package references.builds.kotlinx.io

import BuildParams.KOTLINX_IO_ID
import BuildParams.KOTLINX_IO_RELEASE_LABEL
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.scriptBuildHtml
import references.vcsRoots.KotlinxIO

object KotlinxIOBuildApiReference : BuildApiPages(
    apiId = KOTLINX_IO_ID,
    releaseTag = KOTLINX_IO_RELEASE_LABEL,
    pagesRoot = "build/dokka/html",
    stepDokkaVersionSync = {
        // TODO readme, and disable this step for other libs too
        null
    },
    stepBuildHtml = {
        scriptBuildHtml().let {
            val defaultStep = it
            ScriptBuildStep {
                id = defaultStep.id
                name = defaultStep.name
                // language=bash
                scriptContent = """
                    #!/bin/bash
                     set -e -u
                    ./gradlew :dokkaGenerate --no-daemon
                """.trimIndent()
            }
        }
    },
    init = {
        vcs {
            root(KotlinxIO)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxIOPrepareDokkaTemplates)
        }
    })
