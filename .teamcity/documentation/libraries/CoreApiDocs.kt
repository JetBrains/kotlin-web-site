package documentation.libraries

import documentation.libraries.builds.StdlibDocsLayout
import documentation.libraries.builds.StdlibDocsVersion

/**
 * Core API docs at https://kotlinlang.org/api/core/.
 *
 * The latest version is built from [latest] on every change of its branch; a custom run can use another branch.
 * Every older version is a custom run of the single historical build on a JetBrains/kotlin branch; its version, Kotlin
 * release, layout and Dokka version are run parameters. Tag a successful run with its version (e.g. `2.3`) by hand; the latest build takes
 * the newest run with each tag. `historicalVersions` is the default of the latest build's `stdlib.historicalVersions`
 * parameter; a custom run can list fewer versions.
 *
 * Replace [PLACEHOLDER] with the released Kotlin version whose Maven Central artifacts are documented, and with the
 * JetBrains/kotlin branch that holds `libraries/tools/kotlin-stdlib-docs` for that version. The latest build is
 * created paused while a placeholder is set.
 */
object CoreApiDocs : KotlinLibrariesDocs(
    latest = StdlibDocsVersion(
        version = "2.4",
        deployVersion = PLACEHOLDER,
        branch = "main",
        layout = StdlibDocsLayout.DOKKA2,
    ),
    historicalVersions = listOf(
        "1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9",
        "2.0", "2.1", "2.2", "2.3",
    ),
)
