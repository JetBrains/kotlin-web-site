package landings

import jetbrains.buildServer.configs.kotlin.Project
import landings.builds.BuildLandingPage
import landings.builds.DeployLanding
import landings.builds.LandingDeployTarget

object LandingPagesProject : Project({
  name = "Landing Pages"
  description = "Builds landing pages from repositories"

  landingConfigurations.forEach { config ->
    vcsRoot(createVcsRootForLanding(config))

    buildType(BuildLandingPage(config))
    buildType(DeployLanding(config, LandingDeployTarget.STAGING))
    buildType(DeployLanding(config, LandingDeployTarget.PRODUCTION))
  }
})

