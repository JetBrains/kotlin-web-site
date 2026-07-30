---
name: add-writerside-doc-module
description: Add a new external Writerside documentation source to kotlin-web-site via the
  TeamCity Kotlin DSL (as a sub-documentation source under KotlinWithCoroutines). Use when
  wiring a new Kotlin/* docs repo into the site. Covers the VCS root, its registration, the
  checkout rules, the kr.tree TOC include, v.list version vars, and the README row. The old
  git-submodule approach is obsolete — do not use it.
---

# Add a new Writerside docs module

This skill wires an **external documentation repository** into kotlin-web-site so its pages
are built and published as part of the main Kotlin docs site.

A doc source is now added entirely through the **TeamCity Kotlin DSL** as a
*sub-documentation* source nested under the existing `KotlinWithCoroutines` build (the
`kotlin-reference` module). There is **no git submodule** and **no new build object** for
this pattern — `addSubDocumentation(...)` handles checkout and snippet wiring.

The reference implementation is the **kotlinx.serialization** addition; mirror it.

> Follow `.ai/guidelines.md` at all times (required by `CLAUDE.md`).

## When to use

The user wants to publish docs from another repo (e.g. a new `Kotlin/*` library) on
kotlinlang.org, the same way coroutines, lincheck, dokka, api-guidelines, and serialization
are published.

## Inputs to gather first

Ask the user for (infer sensible defaults from the serialization example where possible):

| Input | Example | Notes |
|-------|---------|-------|
| Object base name | `KotlinxSerialization` | Used as `<base>Root` for the VCS root object. |
| Display name | `Kotlinx Serialization` | Human-readable `name` of the VCS root. |
| Git SSH URL | `git@github.com:Kotlin/kotlinx.serialization.git` | Must be SSH (`git@github.com:...`). |
| Branch | `refs/heads/master` | Full ref. May be a custom docs branch. |
| Checkout dir | `kotlinx.serialization` | Dir name passed to `addSubDocumentation`. |
| Docs layout | default `docs/` **or** custom (e.g. `docs-website`) | Determines whether custom `rules` are needed. |
| External tree file | `serialization.tree` | The `.tree` file that lives in the source repo. |
| origin / element-id | `serialization` | The module id used in the `<include>`. |
| TOC title | `Serialization (kotlinx.serialization)` | Shown in the site sidebar. |
| Version vars | `kotlinxIoVersion=0.9.0`, `okioVersion=3.16.2` | Any `%var%` the docs reference; optional. |
| README row | page URL + repo URL | For the external-docs table. |

## Steps — apply these six edits

Make the edits in this order. Each one is anchored to an existing pattern; append the new
entry alongside the others rather than reformatting the file.

### 1. Add the VCS root

File: `.teamcity/documentation/vcsRoots/DocumentationRoots.kt`

Append a new `GitVcsRoot` object after the last one (currently `KotlinxSerializationRoot`):

```kotlin
object <Base>Root: GitVcsRoot({
    name = "<Display name>"
    url = "<git SSH URL>"
    branch = "<refs/heads/...>"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
```

### 2. Register the VCS root

File: `.teamcity/documentation/DocumentationProject.kt`

Add a line after the last `vcsRoot(...)` call:

```kotlin
vcsRoot(<Base>Root)
```

No import needed — the file already does `import documentation.vcsRoots.*`.

### 3. Wire it as sub-documentation

File: `.teamcity/documentation/builds/KotlinWithCoroutines.kt`

Add an `addSubDocumentation(...)` call inside the `init { }` block, alongside the existing
calls.

- **Default layout** (repo has `docs/` and `docs/snippets/`) — omit the `rules` arg; the
  helper defaults to checking out `.git` + `docs`:

  ```kotlin
  addSubDocumentation("<checkout dir>", <Base>Root)
  ```

- **Custom layout** — pass explicit checkout `rules`. Each rule is
  `+:<srcPathInRepo> => <pathInBuildCheckout>`. You must include `.git`. Example
  (serialization, whose docs live in `docs-website`):

  ```kotlin
  addSubDocumentation("kotlinx.serialization", KotlinxSerializationRoot, """
      +:.git => kotlinx-serialization/.git
      +:docs-website => kotlinx-serialization/docs-website
  """.trimIndent())
  ```

The helper `addSubDocumentation` (defined at the bottom of `KotlinWithCoroutines.kt`, around
line 49) adds the VCS root with checkout rules and prepends a step that symlinks the
module's snippets into `docs/snippets`. Don't duplicate that logic — just call it.

### 4. Include the module in the TOC

File: `docs/kr.tree`

Add (or replace a placeholder `topic=` entry with) a `<toc-element>` that includes the
external tree. Place it near the other library includes (coroutines, lincheck):

```xml
<toc-element toc-title="<TOC title>">
    <include from="<external tree file>" origin="<origin>" element-id="<element-id>"/>
</toc-element>
```

`from` is the `.tree` filename that ships in the source repo; `origin` and `element-id`
identify the module.

### 5. Add version variables (if any)

File: `docs/v.list`

Add a `<var>` for each version the module's docs reference via `%name%`:

```xml
<var name="<name>" value="<value>"/>
```

### 6. Update the README

File: `README.md`

Add a row to the external-docs table (the "Source files ... are stored in separate
repositories" table):

```
| [<Page name> docs](<page URL>) | [<repo name>](<repo URL>) |
```

## Worked example — kotlinx.serialization

This is the exact diff produced by the reference change; use it as a template.

```diff
# DocumentationRoots.kt
+object KotlinxSerializationRoot: GitVcsRoot({
+    name = "Kotlinx Serialization"
+    url = "git@github.com:Kotlin/kotlinx.serialization.git"
+    branch = "refs/heads/doc-restructuring-master"
+    branchSpec = "+:refs/heads/*"
+    checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
+    authMethod = uploadedKey { uploadedKey = "default teamcity key" }
+})

# DocumentationProject.kt
+    vcsRoot(KotlinxSerializationRoot)

# KotlinWithCoroutines.kt  (inside init { })
+        addSubDocumentation("kotlinx.serialization", KotlinxSerializationRoot, """
+            +:.git => kotlinx-serialization/.git
+            +:docs-website => kotlinx-serialization/docs-website
+        """.trimIndent())

# docs/kr.tree
-        <toc-element toc-title="Serialization (kotlinx.serialization)" topic="serialization.md"/>
+        <toc-element toc-title="Serialization (kotlinx.serialization)">
+            <include from="serialization.tree" origin="serialization" element-id="serialization"/>
+        </toc-element>

# docs/v.list
+    <var name="kotlinxIoVersion" value="0.9.0"/>
+    <var name="okioVersion" value="3.16.2"/>

# README.md  (external-docs table)
+| [Serialization docs](https://kotlinlang.org/docs/serialization.html) | [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) |
```

## Pre-conditions to confirm with the user

- The source repo, on the chosen branch, actually contains the referenced `.tree` file and
  the docs path used in the checkout rules.
- The `origin`/`element-id` match what the source repo's tree exposes.

## Verify

- Compile/lint the TeamCity DSL so the new root and registration are valid Kotlin:
  generate the configs (e.g. `cd .teamcity && mvn -q teamcity-configs:generate`, or the
  repo's configured DSL check).
- Confirm `docs/kr.tree` remains valid XML and the new `<include>` resolves the expected
  `origin`/`element-id`.
- Diff the result against the serialization reference shape — the change should touch the
  same six files and nothing else.
