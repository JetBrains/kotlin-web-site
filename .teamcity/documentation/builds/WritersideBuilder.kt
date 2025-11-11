package documentation.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.builds.BuildWebHelpFrontend

abstract class WritersideBuilder(
    module: String,
    instance: String,
    customInit: BuildType.() -> Unit = {}
) : BuildType({
    val dockerImageTag = "2.1.2180-p8506"
    val frontend = "file:///opt/static/"

    name = "${instance.uppercase()} documentation build"
    description = "Build $module/$instance documentation with the docker"

    artifactRules = """
        artifacts/*
        timestamps.json
    """.trimIndent()

    steps {
        script {
            name = "Generate timestamps file"
            scriptContent = """
                echo "Generate timestamps"
                echo "{" > %teamcity.build.checkoutDir%/timestamps.json

                # Process the main repository
                cd %teamcity.build.checkoutDir%
                git ls-tree -r --name-only HEAD | grep -E '\.(topic|md)$' | while read file; do
                    timestamp=${'$'}{'$'}(git log -1 --format="%at" -- "${'$'}{'$'}file")
                    echo "\"${'$'}{'$'}file\": \"${'$'}{'$'}timestamp\"," >> %teamcity.build.checkoutDir%/timestamps.json
                done
                
                # Process all subdirectories containing .git folders
                find %teamcity.build.checkoutDir% -mindepth 2 -maxdepth 2 -type d -name ".git" | while read gitdir; do
                    repo_dir=${'$'}{'$'}(dirname "${'$'}{'$'}gitdir")
                    rel_dir=${'$'}{'$'}(basename "${'$'}{'$'}repo_dir")
                
                    cd "${'$'}{'$'}repo_dir"
                    git ls-tree -r --name-only HEAD | grep -E '\.(topic|md)$' | while read file; do
                        timestamp=${'$'}{'$'}(git log -1 --format="%at" -- "${'$'}{'$'}file")
                        echo "\"${'$'}{'$'}rel_dir/${'$'}{'$'}file\": \"${'$'}{'$'}timestamp\"," >> %teamcity.build.checkoutDir%/timestamps.json
                    done
                done
                
                # Remove trailing comma from last entry
                sed -i '${'$'}{'$'} s/.$//' %teamcity.build.checkoutDir%/timestamps.json
                echo "}" >> %teamcity.build.checkoutDir%/timestamps.json
            """.trimIndent()
        }
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
                -e TIME=/opt/sources/timestamps.json
            """.trimIndent()
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
