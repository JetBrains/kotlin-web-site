---
name: add-api-reference
description: Publish a new kotlinx library API reference on kotlinlang.org/api via the TeamCity
  Kotlin DSL, the way kotlinx.coroutines, kotlinx.serialization, kotlinx-datetime and kotlinx-io
  are published. Use when wiring a Dokka-generated API reference for a Kotlin/* repo into the
  site. Covers the BuildParams consts + API_URLS entry, the VCS root, the three build objects
  (templates / pages / search index), their project registration, the kr.tree nav link, and the
  production navigation test. The worked example is kotlinx.collections.immutable (KTL-4524).
---

# Add a new kotlinx API reference

This skill publishes a library's **Dokka-generated API reference** at
`https://kotlinlang.org/api/<id>/`, built and indexed by the same TeamCity pipeline that
produces the coroutines, serialization, datetime and io references.

Everything is wired through the **TeamCity Kotlin DSL** under `.teamcity/`. A reference is a
fixed set of pieces, all mirroring an existing library — there is no new infrastructure to
write, only new config objects plus a couple of site-side links.

The reference implementation is **kotlinx-datetime**; mirror it. Datetime is the right model
for any library whose Dokka output lives under a `core/` module (`core/build/dokka/html`,
`core/dokka-templates`). For a single-module library whose Dokka output is at the repo root,
mirror **kotlinx-io** instead (`build/dokka/html`, root `dokka-templates`).

> Follow `.ai/guidelines.md` at all times (required by `CLAUDE.md`).

## When to use

The user wants a `Kotlin/*` library's API reference served on kotlinlang.org/api alongside the
other kotlinx libraries — for example, migrating it off a temporary GitHub Pages site.

## Inputs to gather first

Ask the user for these (defaults shown are the **kotlinx.collections.immutable** worked
example). Derive the casing variants from the base name.

| Input | Example (immutable) | Notes |
|-------|---------------------|-------|
| Object / base name | `KotlinxCollectionsImmutable` | PascalCase. Names the VCS root + build objects. |
| Package segment | `collectionsImmutable` | camelCase. The `references.builds.kotlinx.<seg>` package + dir. |
| Const prefix | `KOTLINX_COLLECTIONS_IMMUTABLE` | SCREAMING_SNAKE_CASE for the `BuildParams` consts. |
| API id (slug + title) | `kotlinx.collections.immutable` | The `/api/<id>/` slug, the Algolia index name, and the title. Match the repo's dotted/dashed name and desired URL. |
| Git SSH URL | `git@github.com:Kotlin/kotlinx.collections.immutable.git` | Must be SSH (`git@github.com:...`). |
| Release tag | `v0.5.0` | The branch/tag to build from. **A tag** (e.g. `v0.5.0`) must be wired with the full ref — see Step 2. **A branch** (e.g. `master`, `latest-release`) is used as-is. |
| Release label | `0.5.0` | The displayed version. The drop-snapshot step strips a leading `v`. |
| Dokka HTML output | `core/build/dokka/html` | datetime-style (`core/` module). Root-module libs use `build/dokka/html`. |
| Dokka templates dir | `core/dokka-templates` | Where `dependsOnDokkaTemplate` drops the site templates. Root-module libs use `dokka-templates` (the helper default). |
| Dokka Gradle task | `:kotlinx-collections-immutable:dokkaGenerate` | The task `stepBuildHtml` runs. **Confirm against the repo** (see Pre-conditions). |
| TOC title | `Immutable collections (kotlinx.collections.immutable)` | Sidebar label + the production-test button text. |

## Steps — apply these edits

Make the edits in this order. Each is anchored to an existing pattern; append the new entry
alongside the others rather than reformatting the file. Replace the `<…>` placeholders with the
gathered inputs; the worked example below shows every value filled in.

### 1. Add the BuildParams consts + sitemap entry

File: `.teamcity/BuildParams.kt`

Add four consts inside `object BuildParams`, after the last library block (currently
`KOTLINX_IO_*`):

```kotlin
const val <PREFIX>_RELEASE_TAG = "<release tag>"
const val <PREFIX>_RELEASE_LABEL = "<release label>"
const val <PREFIX>_ID = "<api id>"
const val <PREFIX>_TITLE = <PREFIX>_ID
```

Then add one line to the `API_URLS` list (drives the sitemap index), next to the other
`api/...` entries:

```kotlin
"api/$<PREFIX>_ID",
```

### 2. Add the VCS root

New file: `.teamcity/references/vcsRoots/<Base>.kt`.

**Building from a tag** (e.g. `v0.5.0` — the usual case for a stable release). Use the full ref
via the `VCS.tag(...)` helper and a tag-only `branchSpec`. Do **not** pass a bare tag name to
`branch` with a `+:refs/heads/(*)` spec — TeamCity expands the short name to `refs/heads/<tag>`,
which doesn't exist, and fails with *"Cannot find revision of the default branch"*.

```kotlin
package references.vcsRoots

import BuildParams.<PREFIX>_RELEASE_TAG
import common.extensions.VCS
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object <Base> : GitVcsRoot({
  name = "<api id> vcs root"
  url = "<git SSH URL>"
  branch = VCS.tag(<PREFIX>_RELEASE_TAG)   // refs/tags/<release tag>
  branchSpec = "+:refs/tags/*"
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
```

**Building from a branch** (e.g. `master`, `latest-release` — the kotlinx-io / datetime style).
Use the branch name directly with the heads+tags spec:

```kotlin
  branch = <PREFIX>_RELEASE_TAG            // e.g. "master" or "latest-release"
  branchSpec = """
    +:refs/heads/(*)
    +:refs/tags/(*)
  """.trimIndent()
  useTagsAsBranches = true
```

### 3. Add the three build objects

New directory: `.teamcity/references/builds/kotlinx/<segment>/` with three files.

**`<Base>PrepareDokkaTemplates.kt`** — verbatim from datetime with new ids:

```kotlin
package references.builds.kotlinx.<segment>

import BuildParams.<PREFIX>_ID
import BuildParams.<PREFIX>_TITLE
import jetbrains.buildServer.configs.kotlin.BuildType
import references.templates.PrepareDokkaTemplate

object <Base>PrepareDokkaTemplates : BuildType({
    name = "$<PREFIX>_ID templates"
    description = "Build dokka templates for <human name>"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", <PREFIX>_ID)
        param("env.API_REFERENCE_NAME", <PREFIX>_TITLE)
    }
})
```

**`<Base>BuildApiReference.kt`** — `core/`-module shape (datetime). Drop the `pagesRoot`
`private const`, the `stepBuildHtml` task, and the `dependsOnDokkaTemplate` dir to match a
root-module lib (io) if applicable:

```kotlin
package references.builds.kotlinx.<segment>

import BuildParams.<PREFIX>_ID
import BuildParams.<PREFIX>_RELEASE_LABEL
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.scriptBuildHtml
import references.vcsRoots.<Base>

private const val DOKKA_HTML_RESULT = "<dokka html output>"

object <Base>BuildApiReference : BuildApiPages(
    apiId = <PREFIX>_ID,
    releaseTag = <PREFIX>_RELEASE_LABEL,
    pagesRoot = DOKKA_HTML_RESULT,
    stepBuildHtml = {
        scriptBuildHtml { tasks = "<dokka gradle task>" }
    },
    init = {
        vcs {
            root(<Base>)
        }
        dependencies {
            dependsOnDokkaTemplate(<Base>PrepareDokkaTemplates, "<dokka templates dir>")
        }
    })
```

> If the library's `gradle.properties` uses a non-standard version key (datetime overrides
> `stepDropSnapshot` to strip `versionSuffix=SNAPSHOT`), add a matching `stepDropSnapshot = { … }`
> override — see datetime. The default handles a plain `version=…` property.

**`<Base>BuildSearchIndex.kt`** — verbatim from datetime with new ids:

```kotlin
package references.builds.kotlinx.<segment>

import BuildParams.<PREFIX>_ID
import templates.TemplateSearchIndex

object <Base>BuildSearchIndex : TemplateSearchIndex({
    name = "$<PREFIX>_ID search"
    description = "Build search index for <human name>"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$<PREFIX>_ID")
    }

    dependencies {
        dependency(<Base>BuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$<PREFIX>_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
```

### 4. Register the builds + VCS root in the project

File: `.teamcity/references/BuildApiReferencesProject.kt`

Add the imports (alongside the existing `references.builds.kotlinx.*` and
`references.vcsRoots.*` imports — the latter is a wildcard, so no vcsRoot import is needed):

```kotlin
import references.builds.kotlinx.<segment>.<Base>BuildApiReference
import references.builds.kotlinx.<segment>.<Base>BuildSearchIndex
import references.builds.kotlinx.<segment>.<Base>PrepareDokkaTemplates
```

Inside the `Project({ … })` body, add the three build types next to the others:

```kotlin
buildType(<Base>BuildApiReference)
buildType(<Base>BuildSearchIndex)
buildType(<Base>PrepareDokkaTemplates)
```

…and register the VCS root next to the other `vcsRoot(...)` calls:

```kotlin
vcsRoot(<Base>)
```

### 5. Add the navigation link

File: `docs/kr.tree`

Inside the `<toc-element toc-title="API reference">` block, add a link next to the other
library entries:

```xml
<toc-element toc-title="<TOC title>" href="https://kotlinlang.org/api/<api id>/"/>
```

### 6. Add the production navigation test

File: `test/production/api-navigation.spec.ts`

Add a test mirroring the existing ones, using the **TOC title** as the button text and the
`/api/<id>/` slug:

```typescript
test('Click on "<TOC title short>" button should open the related page', async ({ page }) => {
    const button = await hoverOverApiElement(page, '<TOC title short>');
    await expect(button).toBeVisible();
    await button.click();
    expect(page.url()).toContain('/api/<api id>/');
});
```

`<TOC title short>` is the leading text of the TOC title that `hoverOverApiElement` matches
(e.g. `Immutable collections`).

## Worked example — kotlinx.collections.immutable

The exact change for KTL-4524. Inputs: base `KotlinxCollectionsImmutable`, segment
`collectionsImmutable`, prefix `KOTLINX_COLLECTIONS_IMMUTABLE`, id
`kotlinx.collections.immutable`, repo `git@github.com:Kotlin/kotlinx.collections.immutable.git`,
tag `v0.5.0`, label `0.5.0`, `core/` module layout.

```diff
# .teamcity/BuildParams.kt  (after the KOTLINX_IO_* block)
+  const val KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_TAG = "v0.5.0"
+  const val KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_LABEL = "0.5.0"
+  const val KOTLINX_COLLECTIONS_IMMUTABLE_ID = "kotlinx.collections.immutable"
+  const val KOTLINX_COLLECTIONS_IMMUTABLE_TITLE = KOTLINX_COLLECTIONS_IMMUTABLE_ID

# .teamcity/BuildParams.kt  (in API_URLS)
     "api/$KOTLINX_IO_ID",
     "api/$KOTLINX_METADATA_ID",
+    "api/$KOTLINX_COLLECTIONS_IMMUTABLE_ID",
     "api/${KGP_REFERENCE.urlPart}",
```

```kotlin
// .teamcity/references/vcsRoots/KotlinxCollectionsImmutable.kt  (new)
package references.vcsRoots

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_TAG
import common.extensions.VCS
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxCollectionsImmutable : GitVcsRoot({
  name = "kotlinx.collections.immutable vcs root"
  url = "git@github.com:Kotlin/kotlinx.collections.immutable.git"
  // Pinned to the stable release tag (full ref so the short name isn't resolved as a head).
  branch = VCS.tag(KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_TAG)
  branchSpec = "+:refs/tags/*"
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
```

```kotlin
// .teamcity/references/builds/kotlinx/collectionsImmutable/KotlinxCollectionsImmutablePrepareDokkaTemplates.kt  (new)
package references.builds.kotlinx.collectionsImmutable

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_ID
import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_TITLE
import jetbrains.buildServer.configs.kotlin.BuildType
import references.templates.PrepareDokkaTemplate

object KotlinxCollectionsImmutablePrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_COLLECTIONS_IMMUTABLE_ID templates"
    description = "Build dokka templates for Kotlinx Collections Immutable"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", KOTLINX_COLLECTIONS_IMMUTABLE_ID)
        param("env.API_REFERENCE_NAME", KOTLINX_COLLECTIONS_IMMUTABLE_TITLE)
    }
})
```

```kotlin
// .teamcity/references/builds/kotlinx/collectionsImmutable/KotlinxCollectionsImmutableBuildApiReference.kt  (new)
package references.builds.kotlinx.collectionsImmutable

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_ID
import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_LABEL
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.scriptBuildHtml
import references.scriptDropSnapshot
import references.vcsRoots.KotlinxCollectionsImmutable

private const val DOKKA_HTML_RESULT = "core/build/dokka/html"

object KotlinxCollectionsImmutableBuildApiReference : BuildApiPages(
    apiId = KOTLINX_COLLECTIONS_IMMUTABLE_ID,
    releaseTag = KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_LABEL,
    pagesRoot = DOKKA_HTML_RESULT,
    // gradle.properties has `version=0.5.0` + a separate `versionSuffix=SNAPSHOT`; strip the
    // suffix (the default drop-snapshot only rewrites `version=`). Same as datetime.
    stepDropSnapshot = {
        scriptDropSnapshot {
            // language=bash
            scriptContent = """
                #!/bin/bash
                sed -i -E "s/versionSuffix=SNAPSHOT//gi" ./gradle.properties
            """.trimIndent()
        }
    },
    stepBuildHtml = {
        scriptBuildHtml { tasks = ":kotlinx-collections-immutable:dokkaGenerate" }
    },
    init = {
        vcs {
            root(KotlinxCollectionsImmutable)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxCollectionsImmutablePrepareDokkaTemplates, "core/dokka-templates")
        }
    })
```

```kotlin
// .teamcity/references/builds/kotlinx/collectionsImmutable/KotlinxCollectionsImmutableBuildSearchIndex.kt  (new)
package references.builds.kotlinx.collectionsImmutable

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_ID
import templates.TemplateSearchIndex

object KotlinxCollectionsImmutableBuildSearchIndex : TemplateSearchIndex({
    name = "$KOTLINX_COLLECTIONS_IMMUTABLE_ID search"
    description = "Build search index for Kotlinx Collections Immutable"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_COLLECTIONS_IMMUTABLE_ID")
    }

    dependencies {
        dependency(KotlinxCollectionsImmutableBuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$KOTLINX_COLLECTIONS_IMMUTABLE_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
```

```diff
# .teamcity/references/BuildApiReferencesProject.kt  (imports)
+import references.builds.kotlinx.collectionsImmutable.KotlinxCollectionsImmutableBuildApiReference
+import references.builds.kotlinx.collectionsImmutable.KotlinxCollectionsImmutableBuildSearchIndex
+import references.builds.kotlinx.collectionsImmutable.KotlinxCollectionsImmutablePrepareDokkaTemplates

# .teamcity/references/BuildApiReferencesProject.kt  (Project body)
+    buildType(KotlinxCollectionsImmutableBuildApiReference)
+    buildType(KotlinxCollectionsImmutableBuildSearchIndex)
+    buildType(KotlinxCollectionsImmutablePrepareDokkaTemplates)
...
+    vcsRoot(KotlinxCollectionsImmutable)
```

```diff
# docs/kr.tree  (inside <toc-element toc-title="API reference">)
     <toc-element toc-title="Date and time (kotlinx-datetime)" href="https://kotlinlang.org/api/kotlinx-datetime/"/>
+    <toc-element toc-title="Immutable collections (kotlinx.collections.immutable)" href="https://kotlinlang.org/api/kotlinx.collections.immutable/"/>
     <toc-element toc-title="JVM Metadata (kotlinx-metadata-jvm)" href="https://kotlinlang.org/api/kotlinx-metadata-jvm/"/>
```

```typescript
// test/production/api-navigation.spec.ts  (new test next to the others)
test('Click on "Immutable collections" button should open the related page', async ({ page }) => {
    const immutableButton = await hoverOverApiElement(page, 'Immutable collections');
    await expect(immutableButton).toBeVisible();
    await immutableButton.click();
    expect(page.url()).toContain('/api/kotlinx.collections.immutable/');
});
```

## Pre-conditions to confirm against the source repo

Before relying on the datetime defaults, check these against
`Kotlin/kotlinx.collections.immutable` at the chosen tag (the issue reporter offered to share
the build details on request):

- **The `v0.5.0` tag exists.** If the stable release isn't tagged yet, build from
  `latest-release` (datetime-style) or `master` (io-style) and update the label accordingly.
- **The Dokka Gradle task path** — `:kotlinx-collections-immutable:dokkaGenerate` vs
  `:core:dokkaGenerate` vs a root `:dokkaGenerate`. Verify in the repo's `settings.gradle.kts`
  / `core/build.gradle.kts`.
- **The Dokka HTML output path** (`core/build/dokka/html`) and the **templates dir**
  (`core/dokka-templates`) match where `core/build.gradle.kts` writes/expects them.
- **The version property** in `gradle.properties` — if it's not a plain `version=…`, add a
  `stepDropSnapshot` override (see datetime's `versionSuffix=SNAPSHOT`).
- **The id/slug** matches the desired public URL and the repo naming (immutable uses the dotted
  `kotlinx.collections.immutable`, like coroutines/serialization).

## Verify

- Compile/validate the TeamCity DSL so the new objects, imports and registration are valid
  Kotlin: `cd .teamcity && mvn -q teamcity-configs:generate` (or the repo's configured DSL
  check). It should generate without errors and emit configs for the three new build types.
- Confirm `docs/kr.tree` is still valid XML and the new entry sits under "API reference".
- The change should touch only: `.teamcity/BuildParams.kt`,
  `.teamcity/references/BuildApiReferencesProject.kt`, the new `vcsRoots/<Base>.kt`, the three
  new `builds/kotlinx/<segment>/*.kt` files, `docs/kr.tree`, and
  `test/production/api-navigation.spec.ts` — nothing else.
- After the build runs on TeamCity, `<Base>BuildApiReference` → `<Base>BuildSearchIndex`
  produce and index `/api/<id>/`; the new production navigation test should pass against the
  deployed site.
