package builds.apiReferences.kotlinx.serialization

import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object KotlinxSerializationBuildApiReference : BuildType({
  name = "kotlinx.serialization API reference"

  templates(BuildApiReference)

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

  dependencies {
    dependsOnDokkaTemplate(KotlinxSerializationPrepareDokkaTemplates)
  }
})
