package builds.apiReferences.kgp

import BuildParams.KGP_ID
import BuildParams.KOTLIN_RELEASE_TAG
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.scriptBuildHtml
import builds.apiReferences.vcsRoots.KotlinKGP
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

private const val KGP_API_OUTPUT_DIR = "libraries/tools/gradle/documentation/build/documentation/kotlinlang"
private const val KGP_API_TEMPLATES_DIR = "build/api-reference/templates"

object KotlinGradlePluginBuildApiReference : BuildApiPages(
    apiId = KGP_ID, releaseTag = KOTLIN_RELEASE_TAG,
    pagesRoot = KGP_API_OUTPUT_DIR,
    vcsDefaultTrigger = { enabled = false },
    stepDropSnapshot = { null },
    stepBuildHtml = {
        val defaultStep = scriptBuildHtml()
        ScriptBuildStep {
            id = defaultStep.id
            name = defaultStep.name
            //language=bash
            scriptContent = """
                #!/bin/bash
                 set -e -u
                ./gradlew :gradle:documentation:dokkaKotlinlangDocumentation -PdeployVersion=${
                KOTLIN_RELEASE_TAG.removePrefix("v")
            } --no-daemon --no-configuration-cache
            """.trimIndent()
        }
    },
    init = {
        vcs {
            root(KotlinKGP)
        }

        dependencies {
            dependsOnDokkaTemplate(KotlinGradlePluginPrepareDokkaTemplates, KGP_API_TEMPLATES_DIR)
        }
    })
