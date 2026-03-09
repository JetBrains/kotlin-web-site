package landings.builds

import BuildParams.KLANG_NODE_CONTAINER
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import landings.LandingConfiguration
import common.sanitizeId
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.remoteParameters.hashiCorpVaultParameter
import landings.createVcsRootForLanding
import vcsRoots.KotlinLangOrg

/**
 * Build type for building a Vite landing page.
 * This build:
 * 1. Checks out the landing page repository
 * 2. Patches the Vite config to set the correct base path
 * 3. Installs npm dependencies
 * 4. Builds the static page
 * 5. Publishes the dist folder as an artifact
 */
class BuildLandingPage(private val config: LandingConfiguration) : BuildType({
  id("build_landing_${sanitizeId(config.name)}")
  name = "Build ${config.name} langing page"

  params {
    param("LANDING_NAME", config.name)
    param("AUTO_DEPLOY_TO_PRODUCTION", config.autoDeployToProduction.toString())
    param("teamcity.vault.set.env", "true")
    param("env.AWS_DEFAULT_REGION", "eu-west-1")
    param("env.AWS_ACCESS_KEY_ID", "%KOTLIN_AWS_ACCESS_KEY_ID%")
    param("env.AWS_SECRET_ACCESS_KEY", "%KOTLIN_AWS_SECRET_ACCESS_KEY%")
    param("env.AWS_SESSION_TOKEN", "%KOTLIN_AWS_SESSION_TOKEN%")
    hashiCorpVaultParameter {
      name = "KOTLIN_AWS_ACCESS_KEY_ID"
      display = ParameterDisplay.HIDDEN
      query = "aws-main/sts/kotlin-teamcity-deployer!/access_key"
      vaultId = "kotlin"
    }
    hashiCorpVaultParameter {
      name = "KOTLIN_AWS_SECRET_ACCESS_KEY"
      display = ParameterDisplay.HIDDEN
      query = "aws-main/sts/kotlin-teamcity-deployer!/secret_key"
      vaultId = "kotlin"
    }
    hashiCorpVaultParameter {
      name = "KOTLIN_AWS_SESSION_TOKEN"
      display = ParameterDisplay.HIDDEN
      query = "aws-main/sts/kotlin-teamcity-deployer!/security_token"
      vaultId = "kotlin"
    }
  }

  vcs {
    root(createVcsRootForLanding(config))
    root(vcsRoots.KotlinLangOrg, "+:scripts => kotlin-web-site-scripts")
    cleanCheckout = true
  }

  triggers {
    vcs {
      branchFilter = "+:${config.branch}"
    }
  }

  artifactRules = """
    dist/** => ${config.name}.zip
  """.trimIndent()

  requirements {
    contains("docker.server.osType", "linux")
  }

  steps {
    script {
      name = "Patch Vite config and build"
      scriptContent = """
        #!/bin/sh
        set -e -x -u

        # Patch Vite config
        node kotlin-web-site-scripts/patch-vite-base.mjs ${config.name}

        # Install dependencies
        npm i

        # Build
        npm run build

        # Verify dist folder exists
        if [ ! -d "dist" ]; then
          echo "Error: dist folder not found after build"
          exit 1
        fi
      """.trimIndent()
      dockerImage = KLANG_NODE_CONTAINER
      dockerPull = true
    }
  }
})
