package builds.apiReferences.kotlinx.serialization

import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object KotlinxSerializationBuildApiReference : BuildType({
  name = "kotlinx.serialization API reference"

  templates(BuildApiReference)

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
