package references.builds.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_ID
import BuildParams.KOTLINX_METADATA_RELEASE_TAG
import BuildParams.KOTLIN_RELEASE_LABEL
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.copy
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.scriptBuildHtml
import references.vcsRoots.Kotlin

private const val LIB_DIR = "libraries/kotlinx-metadata/jvm"

object KotlinxMetadataJvmBuildApiReference : BuildApiPages(
    apiId = KOTLINX_METADATA_ID,
    releaseTag = KOTLIN_RELEASE_LABEL,
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
                    ./gradlew :kotlin-metadata-jvm:dokkaHtml -PdeployVersion=${KOTLIN_RELEASE_LABEL} --no-daemon --no-configuration-cache
                """.trimIndent()
            }
        }
    },
    init = {
        vcs {
            root(Kotlin.copy {
                branch = KOTLINX_METADATA_RELEASE_TAG
            })
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxMetadataJvmPrepareDokkaTemplates, "$LIB_DIR/dokka-templates")
        }
    })
