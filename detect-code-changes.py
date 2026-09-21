#!/usr/bin/env python3
"""Detect whether a change adds or edits a runnable Kotlin code sample.

Used to gate .github/workflows/verify-samples.yml: if no runnable sample was
added or edited, the sample verifier doesn't need to run.

A sample counts as verifiable when it mirrors the verifier's tag filter in
.github/workflows/verify-samples.yml:

    #tag="code" & kotlin-runnable="true" & !validate="false"

This script compares the *inventory* of samples in the old and
new revisions of each changed file. A run is needed only when the new revision
contains a sample the old one did not:

    added sample     -> run          removed sample        -> no run
    edited sample    -> run          moved/reordered only  -> no run
    newly runnable   -> run          no longer runnable    -> no run

Usage:
    detect-code-changes.py [base [head]]     # default: compare against HEAD
    detect-code-changes.py --self-test       # parser and verdict regression checks

Reports "changed" by exiting 0 and writing changed=true to $GITHUB_OUTPUT;
reports "unchanged" by exiting 1 and writing changed=false. Any failure to
determine the answer fails *open* (changed), so verification is never skipped
by accident.
"""

import os
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path, PurePosixPath

# Documentation roots to scan, relative to the repository root.
ROOTS = ("docs/topics",)

RUNNABLE_ATTR = "kotlin-runnable"
EXCLUDED_ATTR = "validate"

FENCE_LANGS = {"kotlin"}
FENCE_MARKERS = ("```", "~~~")

# Attributes that change how a sample is compiled or run. Any change
# means the sample must be re-verified.
KEY_ATTRS = frozenset(
    {EXCLUDED_ATTR, "kotlin-min-compiler-version", "kotlin-time-deadline"}
)

ATTR_PAIR_RE = re.compile(r'([\w-]+)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')')


def repo_root():
    return subprocess.check_output(
        ["git", "rev-parse", "--show-toplevel"], text=True
    ).strip()


def should_scan(rel_path):
    """True for a markdown file inside a configured root, at any depth."""
    if not rel_path.endswith(".md"):
        return False
    parts = PurePosixPath(rel_path).parts
    if any(part.startswith(".") for part in parts):
        return False
    return any(
        rel_path == root or rel_path.startswith(root.rstrip("/") + "/") for root in ROOTS
    )


def parse_attrs(line):
    """Parse a {name="value" ...} line into a dict.

    Returns None when the braces hold no name=value pair, so an unrelated {...}
    further down the page isn't mistaken for a block's attributes.
    """
    stripped = line.strip()
    if not (stripped.startswith("{") and stripped.endswith("}")):
        return None
    pairs = ATTR_PAIR_RE.findall(stripped[1:-1])
    if not pairs:
        return None
    return {name: double or single for name, double, single in pairs}


def fence_lang(line):
    """The language of a code block, or None if the line doesn't open a fence."""
    stripped = line.strip()
    for marker in FENCE_MARKERS:
        if stripped.startswith(marker):
            # The info string may be capitalized or carry trailing content.
            return stripped[len(marker):].strip().split(" ")[0].lower(), marker
    return None, None


def dedent(lines):
    """Strip trailing whitespace and the block's common indentation."""
    body = [line.rstrip() for line in lines]
    indents = [len(line) - len(line.lstrip()) for line in body if line.strip()]
    margin = min(indents) if indents else 0
    return "\n".join(line[margin:] if line.strip() else "" for line in body)


def find_samples(content):
    """The runnable Kotlin samples in content, as (key, line) pairs.

    key is the comparison unit: the dedented code together with the attributes
    that affect how it runs. line is the opening fence, for reporting.
    """
    samples = []
    lines = content.split("\n")
    i = 0

    while i < len(lines):
        lang, marker = fence_lang(lines[i])
        if lang not in FENCE_LANGS:
            i += 1
            continue

        start = i + 1
        close = None
        for j in range(i + 1, len(lines)):
            if lines[j].strip() == marker:
                close = j
                break

        if close is None:
            print(f"Warning: unclosed code fence opened at line {start}")
            break

        # The attribute line follows the closing fence, sometimes
        # after one or more blank lines. parse_attrs guards against attaching an
        # unrelated {...} that happens to be the next non-blank line.
        attrs = {}
        for j in range(close + 1, len(lines)):
            if not lines[j].strip():
                continue
            attrs = parse_attrs(lines[j]) or {}
            break

        if attrs.get(RUNNABLE_ATTR) == "true" and attrs.get(EXCLUDED_ATTR) != "false":
            key = (
                dedent(lines[i + 1:close]),
                frozenset(
                    (name, value)
                    for name, value in attrs.items()
                    if name in KEY_ATTRS
                ),
            )
            samples.append((key, start))

        i = close + 1

    return samples


def new_or_changed(old_content, new_content):
    """Samples present in new_content that were not in old_content.

    Compares multisets, so duplicating an existing sample counts as new while
    reordering samples doesn't.
    """
    old = Counter(key for key, _ in find_samples(old_content))
    new_samples = find_samples(new_content)
    remaining = Counter(key for key, _ in new_samples) - old

    added = []
    for key, line in new_samples:
        if remaining[key]:
            remaining[key] -= 1
            added.append(line)
    return sorted(added)


def comparison(base=None, head=None):
    """Resolve what to compare: (git diff range args, old revision).

    Returns (None, None) if the comparison can't be resolved, so the caller
    fails open.
    """
    if base and head:
        try:
            merge_base = subprocess.check_output(
                ["git", "merge-base", base, head], text=True, stderr=subprocess.PIPE
            ).strip()
        except subprocess.CalledProcessError as e:
            print(f"Could not find the merge base of {base} and {head}: {e}")
            return None, None
        return [f"{base}...{head}"], merge_base

    if base or head:
        print("Pass both a base and a head revision, or neither.")
        return None, None

    # HEAD, not a bare `git diff`, so staged changes count too.
    return ["HEAD"], "HEAD"


def candidate_files(diff_args, include_untracked=False):
    """Changed markdown files that could contain a new sample, or None on error.
    Deletions are excluded.
    """
    command = ["git", "diff", "--name-only", "--diff-filter=ACMR"] + diff_args

    try:
        changed = subprocess.check_output(
            command, text=True, stderr=subprocess.PIPE
        ).split("\n")
    except subprocess.CalledProcessError as e:
        print(f"Could not list changed files ({' '.join(command)}): {e}")
        return None

    if include_untracked:
        # git diff cannot see untracked files, so a brand new topic would look
        # unchanged.
        try:
            untracked = subprocess.check_output(
                ["git", "ls-files", "--others", "--exclude-standard", "-z", "*.md"],
                text=True,
                stderr=subprocess.PIPE,
            ).split("\0")
        except subprocess.CalledProcessError as e:
            print(f"Could not list untracked files: {e}")
            return None
        changed += untracked

    return sorted({path for path in changed if path and should_scan(path)})


def read_content(path, revision=None):
    """File content at revision, or from the working tree when revision is None.

    Returns "" when the file doesn't exist there - an added or untracked file
    has no old version, so all of its samples are new.
    """
    if revision is None:
        try:
            return Path(path).read_text(encoding="utf-8")
        except FileNotFoundError:
            return ""
    try:
        return subprocess.check_output(
            ["git", "show", f"{revision}:{path}"], text=True, stderr=subprocess.DEVNULL
        )
    except subprocess.CalledProcessError:
        return ""


def report(changed):
    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a", encoding="utf-8") as f:
            f.write(f"changed={'true' if changed else 'false'}\n")
    return 0 if changed else 1


def self_test():
    CODE = 'fun main() {\n    println("hi")\n}'
    RUNNABLE = '```kotlin\n%s\n```\n{kotlin-runnable="true"}' % CODE
    OTHER = '```kotlin\nfun main() {\n    println("bye")\n}\n```\n{kotlin-runnable="true"}'
    PLAIN = "```kotlin\nval x = 1\n```"
    PROSE = "# Title\n\nSome prose here.\n\nMore prose."

    # (name, content, expected number of runnable samples)
    parse_cases = [
        ("canonical block", RUNNABLE, 1),
        (
            "attributes with a min compiler version",
            '```kotlin\n%s\n```\n{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}' % CODE,
            1,
        ),
        ("attribute line after one blank line", '```kotlin\n%s\n```\n\n{kotlin-runnable="true"}' % CODE, 1),
        ("attribute line after two blank lines", '```kotlin\n%s\n```\n\n\n{kotlin-runnable="true"}' % CODE, 1),
        ("single-quoted attribute values", "```kotlin\n%s\n```\n{kotlin-runnable='true'}" % CODE, 1),
        ("spaces inside the braces", '```kotlin\n%s\n```\n{ kotlin-runnable="true" }' % CODE, 1),
        ("indented block inside a tab", '  ```kotlin\n  %s\n  ```\n  {kotlin-runnable="true"}' % CODE, 1),
        ("capitalized fence", '```Kotlin\n%s\n```\n{kotlin-runnable="true"}' % CODE, 1),
        ("tilde fence", '~~~kotlin\n%s\n~~~\n{kotlin-runnable="true"}' % CODE, 1),
        ("attributes in any order", '```kotlin\n%s\n```\n{validate="true" kotlin-runnable="true"}' % CODE, 1),
        ("non-runnable block", PLAIN, 0),
        ("validate=false block", '```kotlin\n%s\n```\n{kotlin-runnable="true" validate="false"}' % CODE, 0),
        ("non-kotlin fence", '```groovy\nx\n```\n{kotlin-runnable="true"}', 0),
        ("unrelated braces after the block", '```kotlin\n%s\n```\n{style="note"}' % CODE, 0),
        ("unclosed fence", "```kotlin\n%s" % CODE, 0),
    ]

    # (name, old content, new content, should the verifier run)
    verdict_cases = [
        ("add a sample into prose", PROSE, PROSE + "\n\n" + RUNNABLE, True),
        ("add a second sample after an existing one", PROSE + "\n\n" + RUNNABLE,
         PROSE + "\n\n" + RUNNABLE + "\n\n" + OTHER, True),
        ("add a sample at the top of the file", PROSE, RUNNABLE + "\n\n" + PROSE, True),
        ("add a sample at the end of the file", PROSE, PROSE + "\n" + RUNNABLE, True),
        ("add the attribute line to a plain block", PROSE + "\n\n" + PLAIN,
         PROSE + "\n\n" + PLAIN + '\n{kotlin-runnable="true"}', True),
        ("edit a sample body", PROSE + "\n\n" + RUNNABLE, PROSE + "\n\n" + OTHER, True),
        ("bump the min compiler version", PROSE + "\n\n" + RUNNABLE,
         PROSE + "\n\n" + RUNNABLE.replace('"true"}', '"true" kotlin-min-compiler-version="2.4"}'), True),
        ("duplicate an existing sample", PROSE + "\n\n" + RUNNABLE,
         PROSE + "\n\n" + RUNNABLE + "\n\n" + RUNNABLE, True),
        ("remove one sample while editing another", PROSE + "\n\n" + RUNNABLE + "\n\n" + OTHER,
         PROSE + "\n\n" + OTHER.replace('"bye"', '"BYE"'), True),
        ("add a sample in a file that had none", "", RUNNABLE, True),
        ("remove the second of two adjacent samples", PROSE + "\n\n" + RUNNABLE + "\n\n" + OTHER,
         PROSE + "\n\n" + RUNNABLE, False),
        ("remove a sample abutting the previous attribute line",
         PROSE + "\n\n" + RUNNABLE + "\n" + OTHER, PROSE + "\n\n" + RUNNABLE, False),
        ("remove the only sample in a file", PROSE + "\n\n" + RUNNABLE, PROSE, False),
        ("remove the attribute line", PROSE + "\n\n" + RUNNABLE,
         PROSE + "\n\n" + RUNNABLE.replace('\n{kotlin-runnable="true"}', ""), False),
        ("set validate=false", PROSE + "\n\n" + RUNNABLE,
         PROSE + "\n\n" + RUNNABLE.replace('"true"}', '"true" validate="false"}'), False),
        ("reorder two samples", PROSE + "\n\n" + RUNNABLE + "\n\n" + OTHER,
         PROSE + "\n\n" + OTHER + "\n\n" + RUNNABLE, False),
        ("move a sample down the page", PROSE + "\n\n" + RUNNABLE, PROSE + "\n\n" + PROSE + "\n\n" + RUNNABLE, False),
        ("change only the id attribute", PROSE + "\n\n" + RUNNABLE.replace('"true"}', '"true" id="a"}'),
         PROSE + "\n\n" + RUNNABLE.replace('"true"}', '"true" id="b"}'), False),
        ("re-indent a sample into a tab", PROSE + "\n\n" + RUNNABLE,
         PROSE + "\n\n" + "\n".join("  " + line for line in RUNNABLE.split("\n")), False),
        ("edit prose only", PROSE + "\n\n" + RUNNABLE, PROSE + " More.\n\n" + RUNNABLE, False),
        ("delete the whole file", PROSE + "\n\n" + RUNNABLE, "", False),
    ]

    scan_cases = [
        ("docs/topics/arrays.md", True),
        ("docs/topics/tour/kotlin-tour-basic-types.md", True),
        ("docs/topics/.idea/misc.xml", False),
        ("docs/topics/home.topic", False),
        ("README.md", False),
        ("docs/topics-extra/arrays.md", False),
    ]

    failures = 0

    def check(ok, label, detail=""):
        nonlocal failures
        failures += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {label}")
        if not ok and detail:
            print(f"       {detail}")

    for path, expected in scan_cases:
        check(should_scan(path) == expected, f"should_scan({path}) == {expected}")

    for name, content, expected in parse_cases:
        actual = len(find_samples(content))
        check(actual == expected, f"parse: {name}", f"expected {expected} sample(s), found {actual}")

    for name, old, new, expected in verdict_cases:
        actual = bool(new_or_changed(old, new))
        check(
            actual == expected,
            f"verdict: {name}",
            f"expected {'run' if expected else 'no run'}, got {'run' if actual else 'no run'}",
        )

    print(f"\n{failures} failure(s)")
    return 1 if failures else 0


def main(argv):
    if "--self-test" in argv:
        return self_test()

    try:
        root = repo_root()
    except subprocess.CalledProcessError as e:
        print(f"Not a git repository: {e}")
        return report(True)

    os.chdir(root)

    base = argv[0] if len(argv) > 0 else None
    head = argv[1] if len(argv) > 1 else None

    diff_args, old = comparison(base, head)
    files = None if diff_args is None else candidate_files(diff_args, not head)
    if files is None:
        # Fail open: run the verifier rather than risk skipping a broken sample.
        print("Assuming a code sample changed")
        return report(True)

    for path in files:
        try:
            added = new_or_changed(read_content(path, old), read_content(path, head))
        except (OSError, UnicodeDecodeError) as e:
            print(f"Could not read {path}: {e}")
            return report(True)
        if added:
            lines = ", ".join(str(line) for line in added)
            print(f"A code sample was added or edited: {path} (line {lines})")
            return report(True)

    print("No code sample change detected")
    return report(False)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
