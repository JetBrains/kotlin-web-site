package documentation.builds

import documentation.vcsRoots.*
//import jetbrains.buildServer.configs.kotlin.BuildType
//import jetbrains.buildServer.configs.kotlin.FailureAction
//import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinWithCoroutines: WritersideBuilder(
    module = "kotlin-reference",
    instance = "kr",
    customInit = {
        name ="Kotlin Reference with coroutines"
        vcs {
            root(KotlinReferenceRoot, """
            +:docs => docs
            +:.git => .git
            +:.gitmodules => .gitmodules
            +:docs-test-submodule => docs-test-submodule
        """.trimIndent())
            root(KotlinxCoroutinesRoot,"""
            +:docs => kotlinx.coroutines/docs
            +:.git => kotlinx.coroutines/.git
        """.trimIndent())
            root(KotlinxLincheckRoot, """
            +:docs => kotlinx-lincheck/docs
            +:.git => kotlinx-lincheck/.git
        """.trimIndent())
            root(DokkaRoot, """
            +:docs => dokka/docs
            +:.git => dokka/.git
        """.trimIndent())
            root(APIGuidelinesRoot, """
            +:docs => api-guidelines/docs
            +:.git => api-guidelines/.git
        """.trimIndent())
        }
    }
)
