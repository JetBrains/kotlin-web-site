package documentation.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.builds.BuildWebHelpFrontend
import jetbrains.buildServer.configs.kotlin.triggers.vcs

abstract class WritersideBuilder(
    module: String,
    instance: String,
    customInit: BuildType.() -> Unit = {},
    postProcessAdditions: String = postProcessingScript(),
) : BuildType({
    val dockerImageTag = "2025.07.8502"
    val frontend = "file:///opt/static/"

    name = "${instance.uppercase()} documentation build"
    description = "Build $module/$instance documentation with the docker"

    artifactRules = """
        artifacts/*
    """.trimIndent()

    triggers {
        vcs {
            enabled = false
            branchFilter = "+:<default>"
        }
    }

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
        script {
            val fileArchive = "webHelp${instance.uppercase()}2.zip"
            val buildAssetsNumber = "%dep.${BuildWebHelpFrontend.id ?: throw RuntimeException("BuildWebHelpFrontend.id must not be null")}.build.number%"

            id = "post-processing-files"
            name = "Post processing files"
            workingDir = "artifacts"
            // language=bash
            scriptContent = """
                #!/bin/sh
                set -e
                
                apk add zip unzip
                ls -la
                
                unzip "$fileArchive" -d archive
                cd archive
                
                export ASSET_HASH="$buildAssetsNumber"
            """.trimIndent() + "\n\n$postProcessAdditions\n\n" + """
                zip -ru "../$fileArchive" .
                
                cd ../ && rm -rf archive
            """.trimIndent()

            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerImage = "alpine:latest"
        }
    }

    requirements {
        equals("container.engine", "docker")
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

// language=sh
fun postProcessingScript() = "\n" + """
    html_files=$(find . -type f -name '*.html')
    for file in ${'$'}html_files; do
        echo "Processing ${'$'}file"
        sed -i -E "s/(custom-frontend-app\/[^\"^']+\.(js|css))([\"\'])/\1?${'$'}ASSET_HASH\3/g" "${'$'}file"
        
        sed -i 's|href="https://kotlinlang.org/docs/|href="/docs/|g' "${'$'}file"
        sed -i 's|href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/|href="/docs/multiplatform/|g' "${'$'}file"
    done
    
    json_files=$(find . -type f -name '*.json')
    for file in ${'$'}json_files; do
        echo "Processing ${'$'}file"
        sed -i 's|"url":"https://kotlinlang.org/docs/|"url": "/docs/|g' "${'$'}file"
        sed -i 's|"url":"https://www.jetbrains.com/help/kotlin-multiplatform-dev/|"url": "/docs/multiplatform/|g' "${'$'}file"
    done
""".trimIndent() + "\n"
