package landings

import common.sanitizeId
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

fun createVcsRootForLanding(config: LandingConfiguration): GitVcsRoot {
  return GitVcsRoot {
      id("landing_vcs_${sanitizeId(config.name)}")
      name = "Landing: ${config.name}"
      url = config.repositoryUrl
      authMethod = uploadedKey {
          uploadedKey = "default teamcity key"
      }
      branch = "refs/heads/${config.branch}"
  }
}