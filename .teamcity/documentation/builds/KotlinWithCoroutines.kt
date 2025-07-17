package documentation.builds

import documentation.vcsRoots.*
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinWithCoroutines: BuildType ({
    name = "Kotlin Reference with coroutines"
    description = "Kotlin Reference with coroutines documentation build"

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

    artifactRules = """
        artifacts/*
    """.trimIndent()

    steps {
        script {
            name = "Build documentation"
            scriptContent = """
                #!/bin/bash
                set -e -x -u
                
                docker run --rm -v %teamcity.build.checkoutDir%/docs:/opt/sources \
                registry.jetbrains.team/p/writerside/builder/writerside-builder:latest \
                /bin/bash -c "export DISPLAY=:99 && Xvfb :99 & /opt/builder/bin/idea.sh helpbuilderinspect \
                --source-dir /opt/sources \
                --product kotlin-reference/kr \
                --runner teamcity \
                --frontend-url https://kotlinlang.org/docs/static/v3/ \
                --output-dir /opt/sources/artifacts"
            """.trimIndent()
        }
    }

    requirements {
        equals("container.engine","docker")
    }
})
