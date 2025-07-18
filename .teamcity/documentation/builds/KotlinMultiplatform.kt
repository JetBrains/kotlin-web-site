package documentation.builds

import documentation.vcsRoots.KotlinMultiplatformVCS
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinMultiplatform: BuildType ({
    val dockerImageTag = "2.1.2176-p8483"
    val frontend = "https://kotlinlang.org/docs/static/v3/"

    name = "Kotlin Multiplatform"
    description = "KTL-2775 Migrate KMP Dev Docs: Create a Build of KMP Dev Docs in Our Pipeline"

    vcs {
        root(KotlinMultiplatformVCS)
    }

    artifactRules = """
        artifacts/*
    """.trimIndent()

    steps {
        script {
            name = "Build KMP Documentation with the docker"
            scriptContent = """
                docker run --rm -v %teamcity.build.checkoutDir%:/opt/sources \
                -e SOURCE_DIR=/opt/sources \
                -e MODULE_INSTANCE=kotlin-multiplatform-docs/mpd \
                -e RUNNER=teamcity \
                -e FRONTEND=$frontend \
                -e OUTPUT_DIR=/opt/sources/artifacts \
                registry.jetbrains.team/p/writerside/builder/writerside-builder:$dockerImageTag
            """.trimIndent()
        }
    }

    requirements {
        equals("container.engine","docker")
    }
})
