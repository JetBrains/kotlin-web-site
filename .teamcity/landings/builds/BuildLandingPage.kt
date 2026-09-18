package landings.builds

import BuildParams.KLANG_NODE_CONTAINER
import common.extensions.isProjectPlayground
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import landings.LandingConfiguration
import landings.createVcsRootForLanding

/**
 * Build type for building a Vite landing page.
 * This build:
 * - Checks out the landing page repository
 * - Exposes the publishing base path as the VITE_BASE_PATH env variable
 * - Installs npm dependencies
 * - Builds the static page
 * - Publishes the dist folder as an artifact
 */
class BuildLandingPage(val config: LandingConfiguration) : BuildType({
  id(idFor(config))
  name = "Build ${config.name} langing page"

  params {
    param("LANDING_NAME", config.name)
    param("LANDING_BASE_PATH", config.basePath)
    param("AUTO_DEPLOY_TO_PRODUCTION", config.autoDeployToProduction.toString())
    param("env.VITE_BASE_PATH", "%LANDING_BASE_PATH%")
  }

  vcs {
    root(createVcsRootForLanding(config))
    cleanCheckout = true
  }

  triggers {
    vcs {
      enabled = !isProjectPlayground()
      branchFilter = "+:<default>"
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
      name = "Build landing page"
      scriptContent = """
        #!/bin/sh
        set -e -x -u

        # vite.config.ts expects VITE_BASE_PATH.
        echo "VITE_BASE_PATH=${'$'}VITE_BASE_PATH"

        # Install dependencies
        npm ci

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
}) {
  companion object {
    fun idFor(config: LandingConfiguration) = "build_landing_${config.id}"
  }
}
