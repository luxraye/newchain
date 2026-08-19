#!/bin/bash
set -e

# Install dependencies (non-interactive, fast)
pnpm install --frozen-lockfile

# Database migrations run here once a DB is wired up (Phase 1+).
# Phase 0 is fully in-memory — no DB push needed.
