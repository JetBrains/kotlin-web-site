package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_ID
import BuildParams.KOTLIN_RELEASE_LABEL
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.scriptBuildHtml
import builds.apiReferences.vcsRoots.Kotlin
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

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
            root(Kotlin)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxMetadataJvmPrepareDokkaTemplates, "$LIB_DIR/dokka-templates")
        }
    })
