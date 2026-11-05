package documentation.libraries

import documentation.libraries.builds.StdlibDocsLayout
import documentation.libraries.builds.StdlibDocsVersion
import documentation.libraries.builds.stdlibHistoricalDocs
import documentation.libraries.builds.stdlibLatestDocs
import documentation.libraries.vcsRoots.kotlinRepositoryRoot
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.RelativeId

/** Value for a `deployVersion` or branch that is not known yet. Builds that use it are created paused. */
const val PLACEHOLDER = "TODO"

/**
 * Core API (kotlin-stdlib, kotlin-test, kotlin-reflect) documentation built from JetBrains/kotlin with this
 * repository's Dokka templates. Declare historical versions oldest first, then the latest one.
 */
open class KotlinLibrariesDocs(init: KotlinLibrariesDocs.() -> Unit) {
    private val historical = mutableListOf<StdlibDocsVersion>()
    private var latest: StdlibDocsVersion? = null

    /** @param dokkaVersion Overrides the branch's `dokka_version`; `null` keeps the branch default. */
    fun historical(
        version: String,
        deployVersion: String,
        branch: String,
        layout: StdlibDocsLayout = StdlibDocsLayout.LEGACY,
        dokkaVersion: String? = null,
    ) {
        historical += StdlibDocsVersion(version, deployVersion, branch, layout, dokkaVersion)
    }

    fun latest(
        version: String,
        deployVersion: String,
        branch: String,
        layout: StdlibDocsLayout = StdlibDocsLayout.DOKKA2,
        dokkaVersion: String? = null,
    ) {
        check(latest == null) { "Latest version is already set to ${latest?.version}" }
        latest = StdlibDocsVersion(version, deployVersion, branch, layout, dokkaVersion)
    }

    val project: Project
    lateinit var latestBuild: BuildType
        private set

    init {
        init()
        val current = checkNotNull(latest) { "Set the latest Core API docs version" }
        require((historical + current).map { it.version }.toSet().size == historical.size + 1) {
            "Core API docs versions must be unique"
        }

        project = Project {
            id = RelativeId("DocumentationLibraries")
            name = "Libraries"
            description = "Core API documentation (kotlin-stdlib, kotlin-test, kotlin-reflect) for https://kotlinlang.org/api/core/"
        }

        val historicalBuilds = historical.map { target ->
            val root = kotlinRepositoryRoot(target.version, target.branch).also { project.vcsRoot(it) }
            target to stdlibHistoricalDocs(target, root).pauseIfPlaceholder(target).also { project.buildType(it) }
        }
        val latestRoot = kotlinRepositoryRoot(current.version, current.branch).also { project.vcsRoot(it) }
        // The latest build also waits for every historical branch, because it snapshot-depends on them.
        latestBuild = stdlibLatestDocs(current, latestRoot, historicalBuilds).pauseIfPlaceholder(current).also { project.buildType(it) }

        project.buildTypesOrder = listOf(latestBuild) + historicalBuilds.reversed().map { it.second }
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
