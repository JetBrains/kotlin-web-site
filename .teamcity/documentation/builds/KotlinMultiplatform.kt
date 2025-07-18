package documentation.builds

import documentation.vcsRoots.KotlinMultiplatformVCS
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinMultiplatform: BuildType ({
    val dockerImageTag = "2.1.2176-p8483"

    name = "Kotlin Multiplatform"
    description = "KTL-2775 Migrate KMP Dev Docs: Create a Build of KMP Dev Docs in Our Pipeline"

    vcs {
        root(KotlinMultiplatformVCS)
    }

    artifactRules = """
        artifacts/*
    """.trimIndent()

    steps {
//        script {
//            name = "Build documentation"
//            scriptContent = """
//                #!/bin/bash
//                set -e -x -u
//
//                docker run --rm -v %teamcity.build.checkoutDir%:/opt/sources \
//                registry.jetbrains.team/p/writerside/builder/writerside-builder:latest \
//                /bin/bash -c "export DISPLAY=:99 && Xvfb :99 & /opt/builder/bin/idea.sh helpbuilderinspect \
//                --source-dir /opt/sources \
//                --product kotlin-multiplatform-docs/mpd \
//                --runner teamcity \
//                --frontend-url https://kotlinlang.org/docs/static/v3/ \
//                --output-dir /opt/sources/artifacts"
//            """.trimIndent()
//        }
        script {
            name = "Build KMP Documentation with the docker"
            scriptContent = """"""
            dockerImage = "registry.jetbrains.team/p/writerside/builder/writerside-builder:$dockerImageTag"
            dockerRunParameters = """
                --rm -v %teamcity.build.checkoutDir%:/opt/sources \
                -e SOURCE_DIR=/opt/sources \
                -e PRODUCT=kotlin-multiplatform-docs/mpd \
                -e RUNNER=teamcity \
                -e FRONTEND=https://kotlinlang.org/docs/static/v3/ \
                -e OUTPUT_DIR=/opt/sources/artifacts
            """.trimIndent()
        }
    }

    requirements {
        equals("container.engine","docker")
    }
})
