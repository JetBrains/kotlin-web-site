package builds.apiReferences.kgp

import BuildParams.KGP_ID
import BuildParams.KGP_RELEASE_LABEL
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.scriptBuildHtml
import builds.apiReferences.vcsRoots.KotlinKGP
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

private const val KGP_API_OUTPUT_DIR = "libraries/tools/gradle/documentation/build/documentation/kotlinlang"
private const val KGP_API_TEMPLATES_DIR = "build/api-reference/templates"

object KotlinGradlePluginBuildApiReference : BuildApiPages(
    apiId = KGP_ID, releaseTag = KGP_RELEASE_LABEL,
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
                KGP_RELEASE_LABEL
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
