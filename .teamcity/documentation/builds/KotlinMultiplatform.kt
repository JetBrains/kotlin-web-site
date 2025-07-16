package documentation.builds

import documentation.vcsRoots.KotlinMultiplatformVCS
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinMultiplatform: BuildType ({
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
            name = "Build documentation"
            scriptContent = """
                docker run --rm -v %teamcity.build.checkoutDir%:/opt/sources \
                registry.jetbrains.team/p/writerside/builder/writerside-builder:latest \
                /bin/bash -c "export DISPLAY=:99 && Xvfb :99 & /opt/builder/bin/idea.sh helpbuilderinspect \
                --source-dir /opt/sources \
                --product kotlin-multiplatform-docs/mpd \
                --runner teamcity \
                --frontend-url https://kotlinlang.org/docs/static/v3/ \
                --output-dir /opt/sources/artifacts"
            """.trimIndent()
        }
    }


})
