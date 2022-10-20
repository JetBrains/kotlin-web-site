package builds.apiReferences.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object KotlinxCoroutines: BuildType({
  name = "kotlinx.coroutines"

  templates(DokkaReferenceTemplate)

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
    dependency(KotlinxCoroutinesHTML) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }

      artifacts {
        artifactRules = "+:dokka-templates/** => dokka-templates"
      }
    }
  }
})