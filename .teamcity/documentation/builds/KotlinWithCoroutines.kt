package documentation.builds

import documentation.vcsRoots.*
//import jetbrains.buildServer.configs.kotlin.BuildType
//import jetbrains.buildServer.configs.kotlin.FailureAction
//import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinWithCoroutines: WritersideBuilder(
    module = "kotlin-reference",
    instance = "kr",
    customInit = {
        name ="Kotlin Reference wit coroutines"
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

//object KotlinWithCoroutines1: BuildType ({
//    val dockerImageTag = "2.1.2176-p8483"
//    val frontend = "https://kotlinlang.org/docs/static/v3/"
//
//    name = "Kotlin Reference with coroutines"
//    description = "Kotlin Reference with coroutines documentation build"
//
//    vcs {
//        root(KotlinReferenceRoot, """
//            +:docs => docs
//            +:.git => .git
//            +:.gitmodules => .gitmodules
//            +:docs-test-submodule => docs-test-submodule
//        """.trimIndent())
//        root(KotlinxCoroutinesRoot,"""
//            +:docs => kotlinx.coroutines/docs
//            +:.git => kotlinx.coroutines/.git
//        """.trimIndent())
//        root(KotlinxLincheckRoot, """
//            +:docs => kotlinx-lincheck/docs
//            +:.git => kotlinx-lincheck/.git
//        """.trimIndent())
//        root(DokkaRoot, """
//            +:docs => dokka/docs
//            +:.git => dokka/.git
//        """.trimIndent())
//        root(APIGuidelinesRoot, """
//            +:docs => api-guidelines/docs
//            +:.git => api-guidelines/.git
//        """.trimIndent())
//    }
//
//    artifactRules = """
//        artifacts/*
//    """.trimIndent()
//
//    steps {
//        script {
//            name = "Build Kotlin Reference with coroutines documentation with the docker"
//            scriptContent = """
//                docker run --rm -v %teamcity.build.checkoutDir%:/opt/sources \
//                -e SOURCE_DIR=/opt/sources \
//                -e MODULE_INSTANCE=kotlin-reference/kr \
//                -e RUNNER=teamcity \
//                -e FRONTEND=$frontend \
//                -e OUTPUT_DIR=/opt/sources/artifacts \
//                registry.jetbrains.team/p/writerside/builder/writerside-builder:$dockerImageTag
//            """.trimIndent()
//        }
//    }
//
//    requirements {
//        equals("container.engine","docker")
//    }
//})
