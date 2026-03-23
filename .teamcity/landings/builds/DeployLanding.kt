package landings.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import landings.LandingConfiguration

enum class LandingDeployTarget(
  val idPrefix: String,
  val displayName: String,
  val bucket: String
) {
  STAGING("staging", "Staging", "kotlinlang-staging-landings.jetbrains.com"),
  PRODUCTION("production", "Production", "kotlinlang-prod-landings.jetbrains.com")
}

/**
 * Deployment build type for deploying a landing page to staging or production.
 *
 * Staging is automatically triggered when the landing page build succeeds.
 * Production is automatically triggered after staging only if autoDeployToProduction = true,
 * and can always be triggered manually.
 */
class DeployLanding(
  private val config: LandingConfiguration,
  private val target: LandingDeployTarget
) : BuildType({
  id("deploy_landing_${target.idPrefix}_${config.id}")
  name = "Deploy ${config.name} to ${target.displayName}"

  type = Type.DEPLOYMENT

  params {
    param("LANDING_NAME", config.name)
  }

  configureAwsDeploymentParams()

  requirements {
    contains("docker.server.osType", "linux")
  }

  if (target == LandingDeployTarget.STAGING || config.autoDeployToProduction) {
    triggers {
      finishBuildTrigger {
        buildType = BuildLandingPage.idFor(config)
        successfulOnly = true
      }
    }
  }

  dependencies {
    dependency(BuildLandingPage(config)) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        cleanDestination = true
        artifactRules = """
          ${config.name}.zip!** => content/
        """.trimIndent()
      }
    }
  }

  steps {
    script {
      name = "Deploy to S3 ${target.displayName}"
      scriptContent = """
        rclone config create s3 s3 provider=AWS env_auth=true region=us-east-1 && \
        rclone sync -P content/ s3:${target.bucket}/lp/%LANDING_NAME%/ \
          --delete-after \
          --s3-acl private \
          --check-first \
          --fast-list \
          --checksum
      """.trimIndent()
      dockerImage = "rclone/rclone:1.68"
      dockerPull = true
    }
  }
})
