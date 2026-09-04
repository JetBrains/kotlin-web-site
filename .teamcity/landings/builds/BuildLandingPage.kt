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
 * 1. Checks out the landing page repository
 * 2. Prepares the landing for kotlinlang publishing:
 *    runs the landing's own prepare_to_kotlinlang_publishing.mjs if present,
 *    otherwise falls back to the generic patch-vite-base.mjs
 * 3. Installs npm dependencies
 * 4. Builds the static page
 * 5. Publishes the dist folder as an artifact
 */
class BuildLandingPage(val config: LandingConfiguration) : BuildType({
  id(idFor(config))
  name = "Build ${config.name} langing page"

  params {
    param("LANDING_NAME", config.name)
    param("AUTO_DEPLOY_TO_PRODUCTION", config.autoDeployToProduction.toString())
  }

  vcs {
    root(createVcsRootForLanding(config))
    root(vcsRoots.KotlinLangOrg, "+:scripts => kotlin-web-site-scripts")
    cleanCheckout = true
  }

  triggers {
    vcs {
      enabled = !isProjectPlayground()
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
      name = "Prepare Vite config and build"
      scriptContent = """
        #!/bin/sh
        set -e -x -u

        # Prepare the landing for kotlinlang publishing.
        # If the landing repo ships its own prepare script, run it; otherwise
        # fall back to the generic Vite base patcher from kotlin-web-site.
        if [ -f "prepare_to_kotlinlang_publishing.mjs" ]; then
          echo "Using landing-provided prepare_to_kotlinlang_publishing.mjs"
          node prepare_to_kotlinlang_publishing.mjs ${config.name}
        else
          echo "No prepare_to_kotlinlang_publishing.mjs found, falling back to patch-vite-base.mjs"
          node kotlin-web-site-scripts/patch-vite-base.mjs ${config.name}
        fi

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
