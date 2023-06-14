package tests.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs


object E2ETests : BuildType({
  name = "E2E tests"

  vcs {
    root(vcsRoots.KotlinLangOrg)
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
    /*commitStatusPublisher {
      vcsRootExtId = "${vcsRoots.KotlinLangOrg.id}"
      publisher = github {
        githubUrl = "https://api.github.com"
        authType = personalToken {
          token = "%github.oauth%"
        }
      }
    }*/
    pullRequests {
      vcsRootExtId = "${vcsRoots.KotlinLangOrg.id}"
      provider = github {
        authType = token {
          token = "%github.oauth%"
        }
        filterAuthorRole = PullRequests.GitHubRoleFilter.MEMBER_OR_COLLABORATOR
      }
    }
  }
})