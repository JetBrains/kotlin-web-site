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
 * The ID comes from [name], so changing the branch keeps the root and its build history.
 *
 * @param branch Default branch.
 * @param branchSpec Other branches builds can run on. Empty pins the root to [branch].
 */
fun kotlinRepositoryRoot(name: String, branch: String, branchSpec: String = "") = GitVcsRoot {
    id = RelativeId("DocumentationLibraries_Kotlin_${sanitizeId(name)}")
    this.name = "kotlin $name ($branch)"
    url = "https://github.com/JetBrains/kotlin.git"
    this.branch = VCS.branch(branch)
    this.branchSpec = branchSpec
    checkoutPolicy = GitVcsRoot.AgentCheckoutPolicy.USE_MIRRORS
    authMethod = anonymous()
}
