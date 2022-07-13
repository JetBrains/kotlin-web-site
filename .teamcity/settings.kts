import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.notifications
import jetbrains.buildServer.configs.kotlin.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2022.04"

project {
  subProject(Tests)
  vcsRoot(KotlinLangOrgVCSRoot)
}

object Tests : Project({
  name = "Site Tests"

  buildType(E2ETests)
  buildType(E2EProductionTest)
})

object E2ETests : BuildType({
  name = "E2E tests"

  vcs {
    root(KotlinLangOrgVCSRoot)
  }

  triggers {
    vcs {
      branchFilter = "+:pull/*"
    }
  }

  steps {
    script {
      scriptContent = "./scripts/test/up.sh"
    }

    script {
      scriptContent = "./scripts/test/run.sh"
    }

    script {
      scriptContent = "./scripts/test/stop.sh"
    }
  }

  requirements {
    exists("docker.server.version")
    contains("docker.server.osType", "linux")
  }

  features {
    commitStatusPublisher {
      vcsRootExtId = "${KotlinLangOrgVCSRoot.id}"
      publisher = github {
        githubUrl = "https://api.github.com"
        authType = personalToken {
          token = "%github.oauth%"
        }
      }
    }
    pullRequests {
      vcsRootExtId = "${KotlinLangOrgVCSRoot.id}"
      provider = github {
        authType = token {
          token = "%github.oauth%"
        }
        filterAuthorRole = PullRequests.GitHubRoleFilter.MEMBER_OR_COLLABORATOR
      }
    }
  }
})

object E2EProductionTest : BuildType({
  name = "E2E Test in Production"

  vcs {
    root(KotlinLangOrgVCSRoot)
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
                yarn сi:e2e:prod
            """.trimIndent()
      dockerImage = "mcr.microsoft.com/playwright:v1.22.2-focal"
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

object KotlinLangOrgVCSRoot: GitVcsRoot({
  name = "kotlinlang.org VCS root"
  url = "ssh://git@github.com/JetBrains/kotlin-web-site"
  branch = "refs/heads/master"
  branchSpec = "+:refs/heads/*"
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})