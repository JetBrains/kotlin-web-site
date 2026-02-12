package landings

import jetbrains.buildServer.configs.kotlin.Project
import landings.builds.BuildLandingPage

object LandingPagesProject : Project({
  name = "Landing Pages"
  description = "Builds landing pages from repositories"

  landingConfigurations.forEach { config ->
    vcsRoot(createVcsRootForLanding(config))

    buildType(BuildLandingPage(config))
  }
})

