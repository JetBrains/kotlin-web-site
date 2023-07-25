package builds.apiReferences.templates

import BuildParams.DOKKA_TEMPLATES_VERSION
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.Trigger
import jetbrains.buildServer.configs.kotlin.Triggers
import jetbrains.buildServer.configs.kotlin.buildSteps.GradleBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.triggers.VcsTrigger
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

const val DOKKA_SPACE_REPO = "https://maven.pkg.jetbrains.space/kotlin/p/dokka/dev/"

fun BuildSteps.scriptDokkaVersionSync(block: ScriptBuildStep.() -> Unit) = step(
    ScriptBuildStep {
        id = "step-dokka-version-sync-id"
        name = "Sync dokka version with main repository templates"
        dockerImage = "debian"
        scriptContent = """
        #!/bin/bash
        sed -i -E "s/^(dokka_version|dokkaVersion)=.+/\1=%DOKKA_TEMPLATES_VERSION%/gi" ./gradle.properties
        find . -name "*.gradle.kts" -exec sed -i -E "s|mavenCentral|maven(url = \"$DOKKA_SPACE_REPO\")\nmavenCentral|" {} \;
        find . -name "*.gradle" -exec sed -i -E "s|mavenCentral|maven \{ url \"$DOKKA_SPACE_REPO\" \}\nmavenCentral|" {} \;
        """.trimIndent()
    }.apply(block),
)

fun BuildSteps.buildDokkaHTML(block: GradleBuildStep.() -> Unit) = step(
    GradleBuildStep {
        id = "step-build-dokka-html-id"
        name = "Build dokka html"
        tasks = "dokkaHtmlMultiModule"
    }.apply(block),
)

fun Triggers.vcsDefaultTrigger(block: Trigger.() -> Unit) = trigger(
    VcsTrigger {
        id = "trigger-vcs-default-trigger-id"
        branchFilter = "+:<default>"
    }.apply(block)
)

object BuildApiReference : Template({
    name = "Dokka Reference Template"

    artifactRules = "build/dokka/htmlMultiModule/** => pages.zip"

    params {
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
        param("DOKKA_TEMPLATES_VERSION", DOKKA_TEMPLATES_VERSION)
    }

    triggers {
        vcsDefaultTrigger {}
    }

    requirements {
        contains("docker.server.osType", "linux")
    }

    steps {
        scriptDropSnapshot {}
        scriptDokkaVersionSync {}
        buildDokkaHTML {}
    }
})
