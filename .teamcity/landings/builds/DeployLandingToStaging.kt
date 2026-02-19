package landings.builds

import common.sanitizeId
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import landings.LandingConfiguration

/**
 * Deployment build type for deploying a landing page to staging environment.
 * Automatically triggered when the landing page build succeeds.
 */
class DeployLandingToStaging(private val config: LandingConfiguration) : BuildType({
  id("deploy_landing_staging_${sanitizeId(config.name)}")
  name = "Deploy ${config.name} to Staging"

  type = Type.DEPLOYMENT

  params {
    param("LANDING_NAME", config.name)
  }

  requirements {
    contains("docker.server.osType", "linux")
  }

  triggers {
    finishBuildTrigger {
      buildType = "build_landing_${sanitizeId(config.name)}"
      successfulOnly = true
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
      name = "Deploy to S3 Staging"
      scriptContent = """
        rclone config create s3 s3 provider=AWS env_auth=true region=us-east-1 && \
        rclone sync -P content// s3:kotlinlang-staging-landings.jetbrains.com/lp/%LANDING_NAME%/ \
          --delete-after \
          --s3-acl private \
          --check-first \
          --fast-list \
          --checksum
      """.trimIndent()
      dockerImage = "rclone/rclone:latest"
      dockerPull = true
    }
  }
})
