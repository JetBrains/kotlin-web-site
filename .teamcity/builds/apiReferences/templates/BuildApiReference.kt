package builds.apiReferences.templates

import BuildParams.DOKKA_TEMPLATES_VERSION
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import jetbrains.buildServer.configs.kotlin.triggers.vcs

fun BuildSteps.scriptDropSnapshot(block: ScriptBuildStep.() -> Unit) = step(
    ScriptBuildStep {
        id = "step-drop-snapshot-id"
        name = "Drop SNAPSHOT word for deploy"
        dockerImage = "debian"
        scriptContent = """
        #!/bin/bash
        CURRENT_VERSION="$(sed -E s/^v?//g <<<%release.tag%)"
        sed -i -E "s/^version=.+(-SNAPSHOT)?/version=${'$'}CURRENT_VERSION/gi" ./gradle.properties
        """.trimIndent()
    }.apply(block),
)

fun BuildSteps.scriptDokkaVersionSync(block: ScriptBuildStep.() -> Unit) = step(
    ScriptBuildStep {
        id = "step-dokka-version-sync-id"
        name = "Sync dokka version with main repository templates"
        dockerImage = "debian"
        scriptContent = """
        #!/bin/bash
        sed -i -E "s/^dokka_version=.+/dokka_version=%DOKKA_TEMPLATES_VERSION%/gi" ./gradle.properties
        sed -i -E "s/^dokkaVersion=.+/dokkaVersion=%DOKKA_TEMPLATES_VERSION%/gi" ./gradle.properties
        """.trimIndent()
    }.apply(block),
)

object BuildApiReference : Template({
    name = "Dokka Reference Template"

    artifactRules = "build/dokka/htmlMultiModule/** => pages.zip"

    params {
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
        param("DOKKA_TEMPLATES_VERSION", DOKKA_TEMPLATES_VERSION)
        param("DOKKA_TEMPLATE_TASK", "dokkaHtmlMultiModule")
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
        }
    }

    requirements {
        contains("docker.server.osType", "linux")
    }

    steps {
        scriptDropSnapshot {}
        scriptDokkaVersionSync {}
        gradle {
            name = "Build dokka html"
            tasks = "%DOKKA_TEMPLATE_TASK%"
        }
    }
})