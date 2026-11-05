package documentation.libraries

import documentation.libraries.builds.HISTORICAL_BRANCH_PARAM
import documentation.libraries.builds.StdlibDocsVersion
import documentation.libraries.builds.stdlibHistoricalDocs
import documentation.libraries.builds.stdlibLatestDocs
import documentation.libraries.vcsRoots.kotlinRepositoryRoot
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.RelativeId

/** Value for a `deployVersion` or branch that is not known yet. A latest build that uses it is created paused. */
const val PLACEHOLDER = "TODO"

/**
 * Core API (kotlin-stdlib, kotlin-test, kotlin-reflect) documentation built from JetBrains/kotlin with this
 * repository's Dokka templates.
 *
 * @param historicalVersions Default older versions in the selector of [latest], each taken from a tagged run of the
 * historical build.
 */
open class KotlinLibrariesDocs(latest: StdlibDocsVersion, historicalVersions: List<String>) {
    val project: Project
    val historicalBuild: BuildType
    val latestBuild: BuildType

    init {
        require(historicalVersions.toSet().size == historicalVersions.size) { "Core API docs versions must be unique" }
        require(latest.version !in historicalVersions) { "${latest.version} is both latest and historical" }

        project = Project {
            id = RelativeId("DocumentationLibraries")
            name = "Libraries"
            description = "Core API documentation (kotlin-stdlib, kotlin-test, kotlin-reflect) for https://kotlinlang.org/api/core/"
        }

        val historicalRoot = kotlinRepositoryRoot("Historical", "%$HISTORICAL_BRANCH_PARAM%").also { project.vcsRoot(it) }
        historicalBuild = stdlibHistoricalDocs(historicalRoot).also { project.buildType(it) }

        val latestRoot = kotlinRepositoryRoot(latest.version, latest.branch).also { project.vcsRoot(it) }
        latestBuild = stdlibLatestDocs(latest, latestRoot, historicalBuild, historicalVersions)
            .pauseIfPlaceholder(latest)
            .also { project.buildType(it) }

        project.buildTypesOrder = listOf(latestBuild, historicalBuild)
    }

    private fun BuildType.pauseIfPlaceholder(target: StdlibDocsVersion) = apply {
        val missing = listOfNotNull(
            "deployVersion".takeIf { target.deployVersion == PLACEHOLDER },
            "branch".takeIf { target.branch == PLACEHOLDER },
        )
        if (missing.isNotEmpty()) {
            paused = true
            description = "$description. Paused: set ${missing.joinToString(" and ")} in CoreApiDocs"
        }
    }
}
