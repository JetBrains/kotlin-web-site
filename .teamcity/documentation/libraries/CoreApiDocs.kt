package documentation.libraries

/**
 * Published Core API versions at https://kotlinlang.org/api/core/. Each version is a separate build; 2.4 is the latest
 * and lists the others in its version selector.
 *
 * Replace [PLACEHOLDER] with the released Kotlin version whose Maven Central artifacts are documented, and with the
 * JetBrains/kotlin branch that holds `libraries/tools/kotlin-stdlib-docs` for that version. Builds with a placeholder
 * are created paused.
 * Historical branches default to the legacy Dokka layout; pass `layout = StdlibDocsLayout.DOKKA2` for branches
 * that already use the 2.4.20 build (`buildSrc` and `isLatest`).
 *
 * Each historical build produces only its own version. A legacy branch can be shared: for example 1.0–1.6 can all
 * use a branch whose `versions` list contains 1.0–1.6, and each build runs just `all-libs_<version>`.
 * A Dokka 2 branch documents only its `kotlinLanguageVersion`, so it needs one branch per version.
 */
object CoreApiDocs : KotlinLibrariesDocs({
    historical("1.0", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.1", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.2", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.3", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.4", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.5", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.6", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.7", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.8", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("1.9", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("2.0", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("2.1", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("2.2", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    historical("2.3", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
    latest("2.4", deployVersion = PLACEHOLDER, branch = PLACEHOLDER)
})
