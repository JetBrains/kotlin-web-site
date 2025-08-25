package documentation.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.builds.BuildWebHelpFrontend

abstract class WritersideBuilder(
    module: String,
    instance: String,
    customInit: BuildType.() -> Unit = {}
): BuildType({
    val dockerImageTag = "2025.07.8502"
    val frontend = "file:///opt/static/"

    name = "${instance.uppercase()} documentation build"
    description = "Build $module/$instance documentation with the docker"

    artifactRules = """
        artifacts/*
    """.trimIndent()

    steps {
        script {
            name = "Build $module/$instance documentation with the docker"
            scriptContent = """
                #!/bin/bash
                bash -euo pipefail /usr/local/bin/script.sh
            """.trimIndent()
            dockerImage = "registry.jetbrains.team/p/writerside/builder/writerside-builder:$dockerImageTag"
            dockerRunParameters = """
                --rm -v %teamcity.build.checkoutDir%:/opt/sources
                -v %teamcity.build.checkoutDir%/static:/opt/static
                -e SOURCE_DIR=/opt/sources
                -e MODULE_INSTANCE=$module/$instance
                -e RUNNER=teamcity
                -e FRONTEND=$frontend
                -e OUTPUT_DIR=/opt/sources/artifacts
            """.trimIndent()
        }
    }

    requirements {
        equals("container.engine","docker")
    }

    failureConditions {
        testFailure = false
    }

    dependencies {
        artifacts(BuildWebHelpFrontend) {
            buildRule = lastPinned("+:*")
            cleanDestination = true
            artifactRules = "+:static.zip!** => static/"
        }
    }

    customInit()
})
