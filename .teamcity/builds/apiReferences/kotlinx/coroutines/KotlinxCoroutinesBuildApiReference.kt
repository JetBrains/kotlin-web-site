package builds.apiReferences.kotlinx.coroutines

import jetbrains.buildServer.configs.kotlin.BuildType

import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference

object KotlinxCoroutinesBuildApiReference: BuildType({
  name = "kotlinx.coroutines API reference"

  templates(BuildApiReference)

  params {
    param("release.tag", BuildParams.KOTLINX_COROUTINES_RELEASE_TAG)
  }

  vcs {
    root(builds.apiReferences.vcsRoots.KotlinxCoroutines)
  }

  dependencies {
    dependsOnDokkaTemplate(KotlinxCoroutinesPrepareDokkaTemplates)
  }
})