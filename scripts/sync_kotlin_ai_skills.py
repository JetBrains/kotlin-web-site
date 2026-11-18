#!/usr/bin/env python3
"""
Sync the <panels id="kotlin-ai-skills"> block in kotlin-ai-skills.md with the
skill folders in Kotlin/kotlin-agent-skills.

- A skill folder (skills/<name>/SKILL.md) with no matching panel  -> a panel is added.
- A panel whose "AI skill" link points to a folder that no longer exists -> the panel is removed.

Panels are matched to skills by their link:
  https://github.com/Kotlin/kotlin-agent-skills/tree/<branch>/skills/<name>

The script is idempotent: running it when everything is in sync changes nothing.
"""
import argparse
import html
import os
import re
import sys
from pathlib import Path

import yaml

SKILL_URL = "https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/"

PANELS_BLOCK_RE = re.compile(
    r'(<panels\b[^>]*\bid="kotlin-ai-skills"[^>]*>)(.*?)(^[ \t]*</panels>)',
    re.S | re.M,
)
PANEL_RE = re.compile(r"^[ \t]*<panel>.*?</panel>[ \t]*\n", re.S | re.M)
SKILL_LINK_RE = re.compile(
    r'href="https://github\.com/Kotlin/kotlin-agent-skills/tree/[^/"]+/skills/([^/"#?]+)/?"'
)
FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n(.*)\Z", re.S)
H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)


def read_skills(skills_dir: Path) -> dict[str, dict]:
    """Return {folder_name: {"title": ..., "description": ...}} for every skill folder."""
    skills = {}
    for d in sorted(p for p in skills_dir.iterdir() if p.is_dir()):
        skill_md = d / "SKILL.md"
        if not skill_md.is_file():
            continue
        text = skill_md.read_text(encoding="utf-8")
        meta, body = {}, text
        m = FRONTMATTER_RE.match(text)
        if m:
            meta = yaml.safe_load(m.group(1)) or {}
            body = m.group(2)
        h1 = H1_RE.search(body)
        title = h1.group(1) if h1 else d.name.replace("-", " ").capitalize()
        skills[d.name] = {
            "title": title,
            "description": first_sentence(str(meta.get("description", ""))),
        }
    return skills


def first_sentence(text: str) -> str:
    text = " ".join(text.split())
    parts = re.split(r"(?<=[.!?])\s+", text, maxsplit=1)
    return parts[0] if parts else ""


def render_panel(name: str, info: dict) -> str:
    title = html.escape(info["title"], quote=False)
    desc = html.escape(info["description"] or "TODO: add a description.", quote=False)
    return (
        "    <panel>\n"
        f"        <title>{title}</title>\n"
        f"        <p>{desc}</p>\n"
        f'        <a href="{SKILL_URL}{name}" as="button" icon="arrow-right" '
        f'icon-position="right" id="{name}">AI skill</a>\n'
        "    </panel>\n"
    )


def sync(doc: str, skills: dict[str, dict]):
    block = PANELS_BLOCK_RE.search(doc)
    if not block:
        sys.exit('ERROR: <panels id="kotlin-ai-skills"> block not found in the document.')
    opening, inner, closing = block.group(1), block.group(2), block.group(3)

    documented, removed = set(), []

    def drop_if_missing(m: re.Match) -> str:
        link = SKILL_LINK_RE.search(m.group(0))
        if not link:
            return m.group(0)  # panel without a skill link: leave untouched
        name = link.group(1)
        documented.add(name)
        if name in skills:
            return m.group(0)
        removed.append(name)
        return ""

    inner = PANEL_RE.sub(drop_if_missing, inner)

    added = sorted(n for n in skills if n not in documented)
    if added:
        if not inner.endswith("\n"):
            inner += "\n"
        inner += "".join(render_panel(n, skills[n]) for n in added)

    new_doc = doc[: block.start()] + opening + inner + closing + doc[block.end():]
    return new_doc, added, sorted(removed)


def pr_body(added, removed, skills) -> str:
    lines = [
        "Automated sync of `kotlin-ai-skills.md` with "
        "[Kotlin/kotlin-agent-skills](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills).",
        "",
    ]
    if added:
        lines += ["### Added panels", ""]
        lines += [f"- [`{n}`]({SKILL_URL}{n})" for n in added]
        lines += [
            "",
            "> Titles and descriptions are generated from each `SKILL.md` (H1 heading and the first "
            "sentence of the `description`). Please review and polish the wording, and add a "
            "\"Learn more\" link if there is a related guide.",
            "",
        ]
    if removed:
        lines += ["### Removed panels", "", "These skill folders no longer exist:", ""]
        lines += [f"- `{n}`" for n in removed]
        lines += [""]
    if not added and not removed:
        lines += ["No changes."]
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--skills-dir", required=True, type=Path)
    ap.add_argument("--doc", required=True, type=Path)
    ap.add_argument("--pr-body", type=Path, help="Where to write the PR description.")
    args = ap.parse_args()

    skills = read_skills(args.skills_dir)
    if not skills:
        sys.exit(f"ERROR: no skills found in {args.skills_dir}; refusing to remove every panel.")

    doc = args.doc.read_text(encoding="utf-8")
    new_doc, added, removed = sync(doc, skills)
    changed = new_doc != doc
    if changed:
        args.doc.write_text(new_doc, encoding="utf-8")

    print(f"Added: {added or '-'}")
    print(f"Removed: {removed or '-'}")

    if args.pr_body:
        args.pr_body.write_text(pr_body(added, removed, skills), encoding="utf-8")

    if gh_out := os.environ.get("GITHUB_OUTPUT"):
        with open(gh_out, "a") as f:
            f.write(f"changed={'true' if changed else 'false'}\n")
            f.write(f"added={' '.join(added)}\n")
            f.write(f"removed={' '.join(removed)}\n")


if __name__ == "__main__":
    main()