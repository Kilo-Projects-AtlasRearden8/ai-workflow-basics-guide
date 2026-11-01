# STATUS — AI Workflow Basics Guide

## What was built

A beginner manual (docs/ + static HTML site/) on simple AI workflows: choosing
tools, chaining prompts, and keeping humans in the loop. Plain English, step by
step, printable planner, local-first, no API keys. Credits Asdale Dynamics, LLC.

### Files

- `LICENSE` — MIT License, copyright line exactly `Copyright (c) 2026 Asdale Dynamics, LLC`
- `README.md` — project overview, credits Asdale Dynamics, LLC
- `docs/01-choosing-tools.md` — how to pick AI tools as a beginner
- `docs/02-chaining-prompts.md` — linking prompts together step by step
- `docs/03-humans-in-the-loop.md` — review checkpoints and human judgment
- `docs/printable-planner.md` — one-page workflow planner worksheet
- `site/index.html` — home and overview
- `site/choosing-tools.html` — Chapter 1
- `site/chaining-prompts.html` — Chapter 2
- `site/humans-in-the-loop.html` — Chapter 3
- `site/planner.html` — print-ready planner worksheet
- `site/tools/prompt-chain.html` — local-first prompt chaining sandbox (no keys)
- `site/style.css` — site styles
- `site/script.js` — site interactivity (prompt chain tool logic)
- `verify.py` — verification script

## How to run it

- Read the manual: open any `docs/*.md` file, or open `site/index.html` in a web browser.
- Print the planner: open `site/planner.html` and press Ctrl+P / Cmd+P.
- Use the prompt chain tool: open `site/tools/prompt-chain.html` in a browser. It runs entirely client-side; nothing is sent to a server. Turn on "Save in browser" only if you want persistence in localStorage (still local only).
- No build step, no install, no API keys, no accounts required.

## Verification results

Ran `python3 verify.py` — PASSED (all checks ok):

- All 15 required files exist
- No `.github/workflows` directory
- `LICENSE` contains the exact copyright line `Copyright (c) 2026 Asdale Dynamics, LLC`
- `README.md` credits Asdale Dynamics, LLC
- No secrets, API keys, SSN-like, or credit-card-like patterns found in any file
- All HTML files parse as well-formed
- All internal links and CSS/JS references resolve to existing files
- `site/script.js` passes `node --check` syntax validation

Git: initialized, all files committed on `master` (root commit `114eb62`). No push, no remote, no co-author trailers. Commit used the existing git identity (Dylan Asdale).

## Known gaps

- No automated test suite beyond `verify.py` (static site has no build/test tooling by design).
- The prompt chain tool's "Save in browser" uses localStorage, which is cleared if the user clears browser data; export/import (JSON) is the recommended backup.
- HTML pages are static copies of the Markdown docs; if docs are edited, the corresponding HTML should be updated by hand.
- No search, dark mode, or multi-language support (out of scope for this beginner guide).
- Not yet integrated with any local LLM runner (Ollama/LM Studio) — the guide mentions them as options but does not bundle tooling.
