package tests.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildFeatures.notifications
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.schedule


object E2EProductionTest : BuildType({
  name = "E2E Test in Production"

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

  triggers {
    schedule {
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
      scriptContent = """
                yarn install --immutable
                yarn test:production:ci
            """.trimIndent()
      dockerImage = "mcr.microsoft.com/playwright:v1.50.0-noble"
      dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
    }
  }

  features {
    notifications {
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
