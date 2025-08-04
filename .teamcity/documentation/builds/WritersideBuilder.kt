package documentation.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

abstract class WritersideBuilder(
    module: String,
    instance: String,
    customInit: BuildType.() -> Unit = {}
): BuildType({
    val dockerImageTag = "2.1.2176-p8483"
    val frontend = "/docs/static/v3/"

    name = "${instance.uppercase()} documentation build"
    description = "Build $module/$instance documentation with the docker"

    artifactRules = """
        artifacts/*
    """.trimIndent()

    steps {
        script {
            name = "Build $module/$instance documentation with the docker"
            scriptContent = """
                docker run --rm -v %teamcity.build.checkoutDir%:/opt/sources \
                -e SOURCE_DIR=/opt/sources \
                -e MODULE_INSTANCE=$module/$instance \
                -e RUNNER=teamcity \
                -e FRONTEND=$frontend \
                -e OUTPUT_DIR=/opt/sources/artifacts \
                registry.jetbrains.team/p/writerside/builder/writerside-builder:$dockerImageTag
            """
        }
    }

    requirements {
        equals("container.engine","docker")
    }

    customInit()
})
