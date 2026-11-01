#!/usr/bin/env python3
"""Verification script for the AI Workflow Basics Guide project.

Checks:
  - Required files exist
  - LICENSE copyright line is exact
  - README credits Asdale Dynamics, LLC
  - No secrets / API keys / personal data patterns
  - HTML files parse and internal links resolve
  - CSS and JS reference correctly
  - No .github/workflows files
"""
import os
import re
import sys
from html.parser import HTMLParser

ROOT = "/workspace/kilo-lab/ai-workflow-basics-guide"
FAILURES = []


def fail(msg):
    FAILURES.append(msg)
    print("FAIL: " + msg)


def ok(msg):
    print("ok: " + msg)


def rel(path):
    return os.path.relpath(path, ROOT)


# ---------- 1. Required files ----------
required_files = [
    "LICENSE",
    "README.md",
    "docs/01-choosing-tools.md",
    "docs/02-chaining-prompts.md",
    "docs/03-humans-in-the-loop.md",
    "docs/printable-planner.md",
    "site/index.html",
    "site/choosing-tools.html",
    "site/chaining-prompts.html",
    "site/humans-in-the-loop.html",
    "site/planner.html",
    "site/tools/prompt-chain.html",
    "site/style.css",
    "site/script.js",
]
for f in required_files:
    if os.path.isfile(os.path.join(ROOT, f)):
        ok("exists: " + f)
    else:
        fail("missing: " + f)

# ---------- 2. No .github/workflows ----------
wf_dir = os.path.join(ROOT, ".github", "workflows")
if os.path.isdir(wf_dir):
    fail(".github/workflows directory exists (forbidden)")
else:
    ok("no .github/workflows directory")

# ---------- 3. LICENSE exact copyright line ----------
license_path = os.path.join(ROOT, "LICENSE")
with open(license_path) as fh:
    license_text = fh.read()
expected = 'Copyright (c) 2026 Asdale Dynamics, LLC'
if expected in license_text:
    ok("LICENSE contains exact copyright line")
else:
    fail("LICENSE missing exact copyright line: " + expected)

# ---------- 4. README credits ----------
readme_path = os.path.join(ROOT, "README.md")
with open(readme_path) as fh:
    readme_text = fh.read()
if "Asdale Dynamics, LLC" in readme_text:
    ok("README credits Asdale Dynamics, LLC")
else:
    fail("README does not credit Asdale Dynamics, LLC")

# ---------- 5. No secrets / keys / personal data ----------
secret_patterns = [
    (r'sk-[A-Za-z0-9]{20,}', 'OpenAI-style API key'),
    (r'ghp_[A-Za-z0-9]{20,}', 'GitHub personal access token'),
    (r'AKIA[0-9A-Z]{16}', 'AWS access key id'),
    (r'-----BEGIN [A-Z ]+PRIVATE KEY-----', 'private key block'),
    (r'api[_-]?key["\']?\s*[:=]\s*["\'][A-Za-z0-9]{16,}', 'hardcoded API key'),
    (r'\b\d{3}-\d{2}-\d{4}\b', 'SSN-like number'),
    (r'\b\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4}\b', 'credit card-like number'),
]
for dirpath, dirnames, filenames in os.walk(ROOT):
    # skip .git
    if '.git' in dirpath.split(os.sep):
        continue
    for fn in filenames:
        path = os.path.join(dirpath, fn)
        try:
            with open(path, encoding='utf-8', errors='ignore') as fh:
                content = fh.read()
        except Exception:
            continue
        for pat, label in secret_patterns:
            for m in re.finditer(pat, content):
                fail(f"possible secret ({label}) in {rel(path)}: {m.group(0)[:40]}")

# ---------- 6. HTML parse + internal links ----------
class LinkChecker(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.links = []
    def handle_starttag(self, tag, attrs):
        for attr, val in attrs:
            if attr in ("href", "src"):
                self.links.append((tag, attr, val))

html_files = [
    "site/index.html",
    "site/choosing-tools.html",
    "site/chaining-prompts.html",
    "site/humans-in-the-loop.html",
    "site/planner.html",
    "site/tools/prompt-chain.html",
]
for hf in html_files:
    path = os.path.join(ROOT, hf)
    with open(path, encoding="utf-8") as fh:
        content = fh.read()
    parser = LinkChecker(path)
    parser.feed(content)
    # CSS/JS references
    for tag, attr, val in parser.links:
        if val.startswith("http") or val.startswith("mailto:"):
            continue
        # resolve relative to the html file's dir
        base = os.path.dirname(path)
        target = os.path.normpath(os.path.join(base, val))
        if not os.path.isfile(target):
            fail(f"broken link {val} in {rel(hf)} (resolved to {rel(target)})")
        else:
            ok(f"link ok: {val} in {rel(hf)}")

# ---------- 7. All internal html anchors resolve to existing pages ----------
html_pages = set(html_files)
for hf in html_files:
    path = os.path.join(ROOT, hf)
    with open(path, encoding="utf-8") as fh:
        content = fh.read()
    for m in re.finditer(r'href="([^"]+\.html)"', content):
        href = m.group(1)
        base = os.path.dirname(path)
        target = os.path.normpath(os.path.join(base, href))
        if rel(target) not in html_pages and not os.path.isfile(target):
            fail(f"broken html link {href} in {rel(hf)}")

# ---------- 8. Each HTML page references style.css and script.js where appropriate ----------
for hf in html_files:
    path = os.path.join(ROOT, hf)
    with open(path, encoding="utf-8") as fh:
        content = fh.read()
    has_css = 'style.css' in content
    if not has_css:
        fail(f"{rel(hf)} does not reference style.css")
    else:
        ok(f"{rel(hf)} references style.css")

# ---------- 9. Summary ----------
print("\n---")
if FAILURES:
    print(f"VERIFICATION FAILED: {len(FAILURES)} issue(s)")
    for f in FAILURES:
        print("  - " + f)
    sys.exit(1)
else:
    print("VERIFICATION PASSED: all checks ok")
    sys.exit(0)
