#!/usr/bin/env python3
"""Launcher for the Catalog Enrichment demo.

Starts the FastAPI backend on :8000 and the Vite dev server on :5173, streams
both logs with a colored prefix, and prints the URLs that actually work from
outside this VM (Workbench proxy path + external IP).

    python server.py
    python server.py --backend-port 8001 --frontend-port 5174
"""

from __future__ import annotations

import argparse
import atexit
import os
import signal
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"
BACKEND = ROOT / "backend"

METADATA = "http://metadata.google.internal/computeMetadata/v1"

RESET = "\033[0m"
DIM = "\033[2m"
BOLD = "\033[1m"
BLUE = "\033[34m"
GREEN = "\033[32m"
YELLOW = "\033[33m"

procs: list[subprocess.Popen] = []


# ── GCP metadata ─────────────────────────────────────────────────────────


def metadata(path: str, timeout: float = 1.0) -> str | None:
    """Query the metadata server. Returns None off-GCP or on any failure."""
    req = urllib.request.Request(
        f"{METADATA}/{path}", headers={"Metadata-Flavor": "Google"}
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode().strip()
    except Exception:
        return None


def external_ip() -> str | None:
    return metadata("instance/network-interfaces/0/access-configs/0/external-ip")


def proxy_url() -> str | None:
    return metadata("instance/attributes/proxy-url")


# ── Process plumbing ─────────────────────────────────────────────────────


def stream(proc: subprocess.Popen, label: str, color: str) -> None:
    prefix = f"{color}{label:>8}{RESET} {DIM}│{RESET} "
    for line in iter(proc.stdout.readline, ""):
        sys.stdout.write(prefix + line)
        sys.stdout.flush()


def spawn(
    cmd: list[str], cwd: Path, label: str, color: str, env: dict | None = None
) -> subprocess.Popen:
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        env=env,
    )
    procs.append(proc)
    threading.Thread(target=stream, args=(proc, label, color), daemon=True).start()
    return proc


def shutdown(*_args) -> None:
    for p in procs:
        if p.poll() is None:
            p.terminate()
    for p in procs:
        try:
            p.wait(timeout=5)
        except subprocess.TimeoutExpired:
            p.kill()


# ── Main ─────────────────────────────────────────────────────────────────


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--backend-port", type=int, default=8000)
    ap.add_argument("--frontend-port", type=int, default=5173)
    ap.add_argument(
        "--skip-install",
        action="store_true",
        help="Don't run npm install even if node_modules is missing.",
    )
    ap.add_argument(
        "--proxy-base",
        action="store_true",
        help=(
            "Serve assets under /proxy/<PORT>/ so the app works through the "
            "Workbench proxy URL. Breaks plain http://localhost:<PORT>."
        ),
    )
    args = ap.parse_args()

    if not (FRONTEND / "node_modules").is_dir() and not args.skip_install:
        print(f"{BOLD}Installing front-end dependencies…{RESET}")
        if subprocess.run(["npm", "install"], cwd=FRONTEND).returncode != 0:
            print(f"{YELLOW}npm install failed.{RESET}", file=sys.stderr)
            return 1

    signal.signal(signal.SIGINT, lambda *a: (shutdown(), sys.exit(0)))
    signal.signal(signal.SIGTERM, lambda *a: (shutdown(), sys.exit(0)))
    atexit.register(shutdown)

    spawn(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "main:app",
            "--host",
            "0.0.0.0",
            "--port",
            str(args.backend_port),
            "--reload",
        ],
        BACKEND,
        "backend",
        GREEN,
    )
    vite_env = dict(os.environ)
    if args.proxy_base:
        vite_env["VITE_BASE"] = f"/proxy/{args.frontend_port}/"

    spawn(
        [
            "npx",
            "vite",
            "--host",
            "--port",
            str(args.frontend_port),
            "--strictPort",
        ],
        FRONTEND,
        "frontend",
        BLUE,
        env=vite_env,
    )

    time.sleep(3)

    ip = external_ip()
    proxy = proxy_url()
    fp = args.frontend_port

    bar = "─" * 68
    print(f"\n{DIM}{bar}{RESET}")
    print(f"  {BOLD}Catalog Enrichment demo{RESET}")
    print(f"{DIM}{bar}{RESET}")
    if args.proxy_base:
        print(f"  {DIM}Local          disabled (--proxy-base rewrites asset paths){RESET}")
    else:
        print(f"  Local          http://localhost:{fp}")
    if proxy:
        print(f"  {BOLD}Workbench{RESET}      https://{proxy}/proxy/{fp}/")
        if not args.proxy_base:
            print(f"  {DIM}               relaunch with --proxy-base if assets 404 there{RESET}")
    if ip:
        print(f"  External IP    http://{ip}:{fp}   {DIM}(needs a firewall rule){RESET}")
    print(f"  API docs       http://localhost:{args.backend_port}/docs")
    print(f"{DIM}{bar}{RESET}")
    if proxy:
        print(f"  {DIM}Prefer the Workbench URL — no firewall rule required.{RESET}")
    print(f"  {DIM}Ctrl-C to stop both processes.{RESET}\n")

    try:
        while True:
            for p in procs:
                if p.poll() is not None:
                    print(f"{YELLOW}A child process exited — shutting down.{RESET}")
                    shutdown()
                    return 1
            time.sleep(1)
    except KeyboardInterrupt:
        shutdown()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
