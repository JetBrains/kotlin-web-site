package builds.apiReferences.kotlinx.serialization

import jetbrains.buildServer.configs.kotlin.BuildType

import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference

object KotlinxSerializationBuildApiReference : BuildType({
  name = "kotlinx.serialization API reference"

  templates(BuildApiReference)

  params {
    param("release.tag", BuildParams.KOTLINX_SERIALIZATION_RELEASE_TAG)
  }

  vcs {
    root(builds.apiReferences.vcsRoots.KotlinxSerialization)
  }

  dependencies {
    dependsOnDokkaTemplate(KotlinxSerializationPrepareDokkaTemplates)
  }
})
