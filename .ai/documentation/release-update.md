---
description: Make changes for a Kotlin release announcement. Use when the user asks you to update the documentation for an EAP release (Beta1, Beta2, RC, RC2, RC3) or for a final release.
---

# Documentation release update

This document provides instructions for updating Kotlin documentation for the upcoming release.
Key paths, relative to the repository root: `docs/kr.tree`, `docs/v.list`, `docs/topics/eap.md`,
`docs/topics/configure-build-for-eap.md`, `docs/topics/releases.md`, `docs/topics/whatsnew/` (What's new pages),
`docs/topics/compatibility-guides/` (compatibility guides), `docs/topics/home.topic`, and `data/releases.yml`.
The sections below list the exact files to change for each stage and kind.

## Before you start

### Check what kind of release is requested

Every release line has EAP releases before the final release, so first identify both the stage and the kind:

* Stage: Beta1, Beta2, RC, RC2, RC3, or the final release.
* Kind:
  * Language release: X.Y.0, for example 2.5.0.
  * Tooling release: X.Y.20, for example 2.4.20.
  * Bug fix release: X.Y.10 or X.Y.21, for example 2.4.10 or 2.4.21. Bug fix releases require different steps
    than language and tooling releases.

If the stage or the kind isn't clear from the request, ask before making any changes.

### Get the What's new and compatibility guide content

The What's new pages (`docs/topics/whatsnew/`) and the compatibility guides (`docs/topics/compatibility-guides/`)
describe the new features and incompatible changes in each release.

This skill makes **no changes to any What's new files or compatibility guides**. Writing and updating their content are
all done by technical writers.
Leave every file under `docs/topics/whatsnew/` untouched. This skill still updates the *references* to these pages
(in `kr.tree`, `home.topic`, `v.list`, and cross-reference links) as described in the sections below.

File naming convention (used by both page types): drop the dots and the trailing `.0` from the version. For example,
use `whatsnew24.md` / `compatibility-guide-24.md` for 2.4.0, and `whatsnew2420.md` / `compatibility-guide-2420.md`
for 2.4.20. During the EAP cycle the working What's new file is `whatsnew-eap.md`. It is never renamed: for the final
X.Y.0 or X.Y.20 release the writer creates the versioned What's new file, and `whatsnew-eap.md` stays in place (hidden
between cycles and re-shown at the next Beta1). This skill only updates the references to these pages, never the
files themselves.

### Find the release branch

A release branch should exist. For example, for 2.5.0-Beta1 the branch is `2-5-0-beta1`.
If there is no such branch, create it. If the release branch is outdated compared to the master branch, rebase it
on top of the master branch before proceeding.

### Commit the changes

Once all the changes are made, stage them as a single local commit on the release branch with a commit
message following this style: `feat: Kotlin 2.4.20-Beta1 release`. Only create the local commit. Do not push the branch
and do not open a pull request.

## Beta1 release

### Language or tooling release

* In `kr.tree`, remove `hidden="true"` from the `<toc-element></toc-element>` for `whatsnew-eap.md` (if present) and update
  `toc-title` with the name of the new EAP release.
* In `eap.md`:
  * Inside the `<tldr>` element, comment out the "No preview versions are currently available." line and uncomment
    the "Latest Kotlin EAP release" line (only the inner lines are toggled; the `<tldr>` element itself is not commented).
  * Under **## Build details**, if the table is currently replaced by the commented `_No preview versions are
    currently available._` placeholder, comment out that placeholder line and uncomment the `<table>`. Then add or
    update the row with the new EAP release information. For an X.Y.0 release, describe it as a language release; for
    an X.Y.20 release, describe it as a tooling release. A **Build details** row has two cells — build info and build
    highlights — for example:

    ```html
    <tr>
        <td><strong>2.5.0-Beta1</strong>
            <p>Released: <strong>September 23, 2026</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.5.0-Beta1" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A language release with major changes in the language and tooling updates.</p>
            <p>For more details, refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.5.0-Beta1">changelog</a> or <a href="whatsnew-eap.md">What's new in Kotlin 2.5.0-Beta1</a>.</p>
        </td>
    </tr>
    ```
* In `v.list`, update `kotlinEapVersion` and `kotlinEapReleaseDate`.
* In `configure-build-for-eap.md`, inside the `<tldr>` element, comment out the "No preview versions are currently
  available." line and uncomment both the "Latest Kotlin EAP release" line and the "Explore Kotlin EAP release
  details" link line (only the inner lines are toggled; the `<tldr>` element itself is not commented).

Sample PRs:

* https://github.com/JetBrains/kotlin-web-site/pull/5628
* https://github.com/JetBrains/kotlin-web-site/pull/5281
* https://github.com/JetBrains/kotlin-web-site/pull/5467

## Beta2 release

### Language or tooling release

* In `kr.tree`, update the `toc-title` for `whatsnew-eap.md` with the name of the new EAP release.
* In `v.list`, update `kotlinEapVersion` and `kotlinEapReleaseDate`.
* In `eap.md`, update the existing EAP row in the **Build details** table with the new EAP release information
  (replace the previous stage's row — each release line keeps a single EAP row, unlike a bug fix release, which adds
  a new row).

Sample PRs:

* https://github.com/JetBrains/kotlin-web-site/pull/5502
* https://github.com/JetBrains/kotlin-web-site/pull/5334
* https://github.com/JetBrains/kotlin-web-site/pull/4978

## RC, RC2, and RC3 releases

### Language or tooling release

* In `kr.tree`, update `toc-title` for `whatsnew-eap.md` with the name of the new EAP release.
* In `v.list`, update `kotlinEapVersion` and `kotlinEapReleaseDate`.
* In `eap.md`, update the existing EAP row in the **Build details** table with the new EAP release information
  (replace the previous stage's row — each release line keeps a single EAP row, unlike a bug fix release, which adds
  a new row).

Sample PRs:

* https://github.com/JetBrains/kotlin-web-site/pull/5533
* https://github.com/JetBrains/kotlin-web-site/pull/5196
* https://github.com/JetBrains/kotlin-web-site/pull/5218

### Bug fix release

Bug fix release lines (X.Y.10 / X.Y.21) have no Beta stages — only the RC and final stages apply.

* In `eap.md`, add a new entry to the **Build details** table and update it with the current release information.
Describe the release as a bug fix release.

Sample PRs:

* https://github.com/JetBrains/kotlin-web-site/pull/5840
* https://github.com/JetBrains/kotlin-web-site/pull/5654
* https://github.com/JetBrains/kotlin-web-site/pull/5622

## Final release for Kotlin X.Y.0 and X.Y.20

### Update kr.tree:

* Add `hidden="true"` to the `toc-element` for `whatsnew-eap.md`.
* Add a `toc-element` for the new versioned What's new page (for example `whatsnew2420.md`) and **move** the
  `accepts-web-file-names="whatsnew.html"` attribute to it, removing that attribute from the previous What's new page.
* **Language release (X.Y.0) only:** add a new `toc-element` for the new compatibility guide (for example
  `compatibility-guide-24.md`) and **move** the `accepts-web-file-names="compatibility-guide.html"` attribute to it,
  removing that attribute from the previous guide. The tree keeps one compatibility-guide `toc-element` per release
  line, so add a new entry rather than repointing an existing one. A tooling release (X.Y.20) usually reuses the
  language-version guide; confirm with the writer.
* Update the **Earlier Kotlin versions** section: only the major and minor releases for the current release line
  (2.x) stay at the top. Move the previous release line's What's new and compatibility-guide `toc-element`s down into
  their own `Kotlin X.Y.x` group under **Earlier Kotlin versions**.

### Update v.list:

Update every variable in `v.list` that changed for this release. The sources are listed below; for any variable not
listed here, ask the writer for the value instead of guessing. Some items apply only to a language release (X.Y.0) and
are marked accordingly; they don't change for a tooling release (X.Y.20).

* `kotlinVersion`, `kotlinLatestUrl`, `kotlinReleaseDate`, `kotlinLatestWhatsnew` (this is a pointer to the versioned
  What's new page, so updating it is allowed — it's a reference, not an edit to the What's new file itself)
* `coroutinesVersion` and `coroutinesEapVersion` with the latest releases from the [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines/releases)
  repository. If there is no EAP version, use the same as coroutinesVersion.
* `serializationVersion` with the latest stable release from the [`kotlinx.serialization` repository](https://github.com/Kotlin/kotlinx.serialization/releases)
* `dateTimeVersion` with the latest stable release from the [`kotlinx-datetime` repository](https://github.com/Kotlin/kotlinx-datetime/releases)
* `lincheckVersion` with the latest stable release from the [Lincheck repository](https://github.com/JetBrains/lincheck/releases)
* `kotlinxBrowserVersion` with the latest stable release from the [`kotlinx-browser` repository](https://github.com/Kotlin/kotlinx-browser/blob/master/README.md)
* `kotlinxIoVersion` with the latest stable release from the [`kotlinx-io` repository](https://github.com/Kotlin/kotlinx-io/releases)
* `okioVersion` with the latest stable release from the [Okio repository](https://mvnrepository.com/artifact/com.squareup.okio/okio)
* `dokkaVersion` with the latest stable release from the [Dokka repository](https://github.com/Kotlin/dokka/releases)
* `jctoolsVersion` with the latest stable release from the [JCTools repository](https://github.com/JCTools/JCTools/releases)
* `foojayResolver` with the latest release of the [Foojay Toolchains Plugin](https://github.com/gradle/foojay-toolchains/tags)
* `webpackMajorVersion` and `webpackPreviousMajorVersion` with the latest release from [Webpack.js](https://github.com/webpack/webpack/releases)
* `sqlDelightVersion` with the latest stable release from [Sqldelight repository](https://github.com/sqldelight/sqldelight/releases)
* `kspVersion` with the latest stable release from Google's [KSP repository](https://github.com/google/ksp/releases)
* `ktorVersion` with the latest stable release from the [Ktor repository](https://github.com/ktorio/ktor/releases)
* Update `lombokVersion` plugin version with the latest stable release from [Gradle plugins](https://github.com/freefair/gradle-plugins)
* `springBootVersion` with the latest stable release from the [Spring Boot repository](https://github.com/spring-projects/spring-boot/releases),
  and `springBootSupportedKotlinVersion` with the Kotlin version that Spring Boot ships; ask the writer if unsure.
* `xcode` with the latest Xcode version supported by Kotlin/Native; ask the writer if unsure.
* `mavenPluginVersion`: ask the writer for the value; do not come up with it yourself.
* Ask if `mavenExtensionsVersion` for the `<extensions>` feature needs to be updated
* `languageVersion`, `apiVersion` (language release X.Y.0 only)
* Check [`TestVersions.kt`](https://github.com/JetBrains/kotlin/blob/<this-release>/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/kotlin/org/jetbrains/kotlin/gradle/testbase/TestVersions.kt)
  (change `<this-release>` part to this specific release, for example `2.5.0`) and update: `minGradleVersion`, `maxGradleVersion`,
  gradleVersion (which should contain the same version of `maxGradleVersion` after Gradle 9.0.0), `minAndroidGradleVersion`,
  `maxAndroidGradleVersion`.
* `gradleLanguageVersion` and `gradleApiVersion` with KOTLIN_X_Y where X and Y refer to Kotlin X.Y.0 (language release
  X.Y.0 only)

### Update `releases.md`

* Update the `tl;dr` block, the **Upcoming releases** and **Release details** sections.
* Ask for the public dates to update the **Upcoming releases** section.
* The standard library security support table lives in `releases.md`. Locate it there, then ask the writer how to update it.

### Gradle pages

* In `gradle-configure-project.md#apply-the-plugin`, add a new entry to the table.
* In `gradle-compiler-options.md#attributes-specific-to-jvm-and-javascript`, add new entries for `languageVersion` and
  `apiVersion` (language release X.Y.0 only). Ask if the oldest version might be removed in this release.
* In `gradle-plugin-variants.md`, update the Gradle versions in the Gradle plugins variants list (find the file in the
  correct branch for the release)

### Maven pages

* In `maven-compile-package.md#attributes-specific-to-jvm`, add new entries for `languageVersion` and `apiVersion`
  (language release X.Y.0 only). Ask if the oldest version might be removed in this release.

### Other pages

* In `data/releases.yml`, update the `version` and `url` for the latest release
* Revert `eap.md` to the no-preview state: re-comment the **Build details** `<table>` and the "Latest Kotlin EAP
  release" `<tldr>` line, and uncomment the two "No preview versions" placeholder lines (do not delete the
  scaffolding the next Beta1 re-activates).
* In `home.topic`, update the link to this release's What's new page, the description, and the versioned What's new
  file name referenced by the link (for example `whatsnew2420.md`).
* Revert `configure-build-for-eap.md` to the no-preview state: inside the `<tldr>` element, re-comment the "Latest
  Kotlin EAP release" and "Explore Kotlin EAP release details" lines, and uncomment the "No preview versions are
  currently available." line.
* Language release (X.Y.0) only: update the previous compatibility guide's `toc-title` in `kr.tree` to the previous
  release line (for example "Kotlin 2.3.x" when releasing 2.4.0).

Sample PRs:

* https://github.com/JetBrains/kotlin-web-site/pull/5795
* https://github.com/JetBrains/kotlin-web-site/pull/5586
* https://github.com/JetBrains/kotlin-web-site/pull/5237

## Final release for Kotlin X.Y.10 and X.Y.21

* In `data/releases.yml`, update the `version` and `url` for the latest release
* Revert `eap.md` to the no-preview state: re-comment the **Build details** `<table>` and the "Latest Kotlin EAP
  release" `<tldr>` line, and uncomment the two "No preview versions" placeholder lines (do not delete the
  scaffolding the next Beta1 re-activates).
* In `releases.md`, add the new row to the **Release details** section.
* In `v.list`, update `kotlinVersion`, `kotlinLatestUrl`, and `kotlinReleaseDate`.

In `releases.md`, a bug fix release updates only the **Release details** section. It intentionally skips the `tl;dr`
block and the **Upcoming releases** section (unlike a language or tooling release, which updates all three).

Do not edit any What's new files yourself. Unlike language and tooling
releases, a bug fix release does not create a new What's new page or compatibility guide.

Sample PRs:

* https://github.com/JetBrains/kotlin-web-site/pull/5648
* https://github.com/JetBrains/kotlin-web-site/pull/5104
* https://github.com/JetBrains/kotlin-web-site/pull/4677

## Verify your changes

Before finishing, check your work:

* Confirm every variable you changed in `v.list` still resolves on the pages that use it, and that you didn't leave
  any old version strings behind.
* Confirm that newly added files (What's new page, compatibility guide) are referenced from `kr.tree`,
  `home.topic`, and any cross-reference links, and that no page still points to the old file name.
* Check that internal links and anchors into the What's new page still resolve.
* Confirm the `accepts-web-file-names="whatsnew.html"` attribute exists on exactly one What's new page (the newest).
