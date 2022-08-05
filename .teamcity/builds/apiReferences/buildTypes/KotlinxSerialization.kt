package builds.apiReferences.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object KotlinxSerialization : BuildType({
  name = "Kotlinx.Serialization"

  templates(DokkaReferenceTemplate)

  params {
    param("release.tag", BuildParams.KOTLINX_SERIALIZATION_RELEASE_TAG)
  }

  vcs {
    root(builds.apiReferences.vcsRoots.KotlinxSerialization)
  }

  triggers {
    vcs {
      branchFilter = "+:<default>"
    }
  }
})
