package landings

import jetbrains.buildServer.configs.kotlin.Project
import landings.builds.BuildLandingPage
import landings.builds.DeployLandingToStaging
import landings.builds.DeployLandingToProduction

object LandingPagesProject : Project({
  name = "Landing Pages"
  description = "Builds landing pages from repositories"

  landingConfigurations.forEach { config ->
    vcsRoot(createVcsRootForLanding(config))

    buildType(BuildLandingPage(config))
    buildType(DeployLandingToStaging(config))
    buildType(DeployLandingToProduction(config))
  }
})

