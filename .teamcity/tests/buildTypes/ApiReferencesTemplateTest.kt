package tests.buildTypes

import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildApiReference
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimeBuildApiReference
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildApiReference
import builds.kotlinlang.buidTypes.BuildJsAssets
import jetbrains.buildServer.configs.kotlin.BuildStep
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object ApiReferencesTemplateTest: BuildType({
  name = "Api References Template Test"

  vcs {
    root(vcsRoots.KotlinLangOrg)
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
    dependency(KotlinxCoroutinesBuildApiReference) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:pages.zip!** => api/kotlinx.coroutines/"
      }
    }

    dependency(KotlinxSerializationBuildApiReference) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:pages.zip!** => api/kotlinx.serialization/"
      }
    }

    dependency(KotlinxDatetimeBuildApiReference) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:pages.zip!** => api/kotlinx-datetime/"
      }
    }

    dependency(BuildJsAssets) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:assets.zip!_assets => _assets"
      }
    }
  }

  steps {
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
})
