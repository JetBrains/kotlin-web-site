package tests.buildTypes

import common.E2ERunner
import common.extensions.isProjectPlayground
import jetbrains.buildServer.configs.kotlin.buildFeatures.notifications
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.schedule


object E2EProductionTest : E2ERunner({
    name = "E2E Test in Production"

    params {
        param("env.BASE_URL", "https://kotlinlang.org")
    }

    triggers {
        schedule {
            enabled = !isProjectPlayground()
            schedulingPolicy = cron {
                seconds = "0"
                minutes = "0"
                hours = "6-18/2"
                dayOfMonth = "1/1"
                month = "*"
                dayOfWeek = "?"
            }
            triggerBuild = always()
            branchFilter = "+:master"
            withPendingChangesOnly = false
        }
    }

    steps {
        script {
            name = "Run E2E tests"
            // language=sh
            scriptContent = """
                yarn install --immutable
                yarn test:ci
            """.trimIndent()
            dockerImage = "mcr.microsoft.com/playwright:v1.57.0"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    features {
        notifications {
            branchFilter = "+:master"
            enabled = !isProjectPlayground()
            notifierSettings = slackNotifier {
                connection = "PROJECT_EXT_486"
                sendTo = "#kotlin-web-site-e2e-tests"
                messageFormat = simpleMessageFormat()
            }
            buildFailedToStart = true
            buildFailed = true
            buildProbablyHanging = true
        }
    }
})
