package tests.buildTypes

import builds.kotlinlang.buidTypes.BuildReferenceDocs
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.buildSteps.script


object E2ETests : BuildType({
  name = "E2E tests"

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

    dependencies {
        artifacts(BuildReferenceDocs) {
            cleanDestination = true
            artifactRules = "+:docs.zip!** => dist/docs/"
        }
    }

  steps {
      script {
          name = "Create stubs instead of real assets"
          scriptContent = """
            mkdir _assets
            mkdir libs
        """.trimIndent()
      }

      script {
          scriptContent = "docker compose -f docker-compose-e2e-statics.yml up --exit-code-from playwright"
      }
  }

    artifactRules = """
      +:test-results/ => test-results/
    """.trimIndent()

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
})