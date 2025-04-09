package builds.common

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.BuildTypeSettings
import jetbrains.buildServer.configs.kotlin.Dependencies
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script

fun Dependencies.dependsOnDokkaTemplate(build: BuildType, artifactPath: String? = null) {
    dependency(build) {
        snapshot {
            onDependencyFailure = FailureAction.FAIL_TO_START
            onDependencyCancel = FailureAction.CANCEL
        }
        artifacts {
            artifactRules = "+:dokka-templates/** => ${artifactPath ?: "dokka-templates"}"
            cleanDestination = true
        }
    }
}

fun BuildTypeSettings.configureReferenceTemplate() {
    artifactRules = """
        dokka-templates/** => dokka-templates
    """.trimIndent()

    requirements {
        doesNotContain("teamcity.agent.name", "windows")
    }

    steps {
        script {
            name = "Fix npm sharp platform related issue"
            scriptContent = """
                rm -rf node_modules/sharp
            """.trimIndent()
        }
        script {
            name = "Install dependencies"
            scriptContent = """
                yarn install --frozen-lockfile
            """.trimIndent()
            dockerImage = "node:16-alpine"
        }
        script {
            name = "Build Templates"
            scriptContent = """
                node ./scripts/dokka/generate-templates.js
            """.trimIndent()
            dockerImage = "node:16-alpine"
        }
    }
}
