package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_ID
import BuildParams.KOTLIN_RELEASE_TAG
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.scriptBuildHtml
import builds.apiReferences.vcsRoots.KotlinMetadataJvm
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

private const val LIB_DIR = "libraries/kotlinx-metadata/jvm"

object KotlinxMetadataJvmBuildApiReference : BuildApiPages(
    apiId = KOTLINX_METADATA_ID,
    releaseTag = KOTLIN_RELEASE_TAG,
    pagesRoot = "$LIB_DIR/build/dokka",
    vcsDefaultTrigger = { enabled = false },
    stepDropSnapshot = { null },
    stepBuildHtml = {
        scriptBuildHtml().let {
            val defaultStep = it
            ScriptBuildStep {
                id = defaultStep.id
                name = defaultStep.name
                //language=bash
                scriptContent = """
                    #!/bin/bash
                     set -e -u
                    ./gradlew :kotlin-metadata-jvm:dokkaHtml -PdeployVersion=${KOTLIN_RELEASE_TAG.removePrefix("v")} --no-daemon --no-configuration-cache
                """.trimIndent()
            }
        }
    },
    init = {
        vcs {
            root(KotlinMetadataJvm)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxMetadataJvmPrepareDokkaTemplates, "$LIB_DIR/dokka-templates")
        }
    })
