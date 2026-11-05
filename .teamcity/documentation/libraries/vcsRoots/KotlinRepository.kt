package documentation.libraries.vcsRoots

import common.extensions.VCS
import common.sanitizeId
import jetbrains.buildServer.configs.kotlin.RelativeId
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

/**
 * Paths of JetBrains/kotlin read by `libraries/tools/kotlin-stdlib-docs`, checked for branches 1.6.20 through 2.4.20.
 * The full repository is several gigabytes; the docs build only needs library sources, samples and its own Gradle project.
 */
val STDLIB_DOCS_CHECKOUT_RULES = """
    +:gradle.properties
    +:libraries/stdlib
    +:libraries/kotlin.test
    +:libraries/reflect
    +:libraries/tools/kotlin-stdlib-docs
    +:core/builtins
    +:core/reflection.jvm
    +:kotlin-native/runtime
    +:kotlin-native/Interop
""".trimIndent()

/**
 * One root per docs version, pinned to a single branch: `branchSpec` is empty so builds never switch branches.
 * The ID comes from the version, so changing the branch keeps the root and its build history.
 */
fun kotlinRepositoryRoot(version: String, branch: String) = GitVcsRoot {
    id = RelativeId("DocumentationLibraries_Kotlin_${sanitizeId(version)}")
    name = "kotlin $version ($branch)"
    url = "git@github.com:JetBrains/kotlin.git"
    this.branch = VCS.branch(branch)
    branchSpec = ""
    checkoutPolicy = GitVcsRoot.AgentCheckoutPolicy.USE_MIRRORS
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
}
