package builds.apiReferences

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.Dependencies
import jetbrains.buildServer.configs.kotlin.FailureAction

fun Dependencies.dependsOnDokkaTemplate(build: BuildType) {
  dependency(build) {
    snapshot {
      onDependencyFailure = FailureAction.CANCEL
      onDependencyCancel = FailureAction.CANCEL
    }

    artifacts {
      artifactRules = "+:dokka-templates/** => dokka-templates"
    }
  }
}

fun Dependencies.dependsOnDokkaPagesJson(build: BuildType) {
  dependency(build) {
    snapshot {
      onDependencyFailure = FailureAction.CANCEL
      onDependencyCancel = FailureAction.CANCEL
    }

    artifacts {
      artifactRules = "+:pages.zip!scripts/pages.json => api-references"
    }
  }
}
