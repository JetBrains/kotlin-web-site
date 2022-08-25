package tests.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildStep
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object ApiReferencesTemplateTest: BuildType({
  name = "Api References Template Test"

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

  triggers {
    vcs {
      branchFilter = "+:pull/*"
    }
  }

  steps {
    script {
      scriptContent = """
        yarn install --frozen-lockfile
        yarn build:production
      """.trimIndent()
      dockerImage = "node:14-alpine"
    }
    script {
      scriptContent = "./scripts/dokka/up.sh"
    }
    script {
      scriptContent = "./scripts/dokka/run.sh"
    }
    script {
      scriptContent = "./scripts/dokka/stop.sh"
      executionMode = BuildStep.ExecutionMode.ALWAYS
    }
  }

  requirements {
    exists("docker.server.version")
    contains("docker.server.osType", "linux")
  }

  features {
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

  dependencies {
    dependency(builds.apiReferences.buildTypes.KotlinxCoroutines) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }

      artifacts {
        artifactRules = "+:pages.zip!** => libs/kotlinx.coroutines/"
      }
    }

    dependency(builds.apiReferences.buildTypes.KotlinxSerialization) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }

      artifacts {
        artifactRules = "+:pages.zip!** => libs/kotlinx.serialization/"
      }
    }
  }
})