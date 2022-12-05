package builds.apiReferences.kotlinx.coroutines

import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object KotlinxCoroutinesBuildApiReference: BuildType({
  name = "kotlinx.coroutines API reference"

  templates(BuildApiReference)

  params {
    param("release.tag", BuildParams.KOTLINX_COROUTINES_RELEASE_TAG)
  }

  vcs {
    root(builds.apiReferences.vcsRoots.KotlinxCoroutines)
  }

  triggers {
    vcs {
      branchFilter = "+:<default>"
    }
  }

  dependencies {
    dependsOnDokkaTemplate(KotlinxCoroutinesPrepareDokkaTemplates)
  }
})