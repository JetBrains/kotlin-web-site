package builds.apiReferences.kotlinx.io

import BuildParams.KOTLINX_IO_ID
import BuildParams.KOTLINX_IO_RELEASE_TAG
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.scriptBuildHtml
import builds.apiReferences.vcsRoots.KotlinxIO
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

object KotlinxIOBuildApiReference : BuildApiPages(
    apiId = KOTLINX_IO_ID,
    releaseTag = KOTLINX_IO_RELEASE_TAG.removePrefix("v"),
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
                    ./gradlew dokkaHtmlMultiModule --no-daemon --no-configuration-cache
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
