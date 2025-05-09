package references

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.Dependencies
import jetbrains.buildServer.configs.kotlin.FailureAction

fun Dependencies.dependsOnDokkaTemplate(build: BuildType, artifactPath: String = "dokka-templates") {
  dependency(build) {
    snapshot {
      onDependencyFailure = FailureAction.FAIL_TO_START
      onDependencyCancel = FailureAction.CANCEL
    }
    artifacts {
      artifactRules = "+:dokka-templates/** => $artifactPath"
      cleanDestination = true
    }
  }
}

fun Dependencies.dependsOnDokkaPagesJson(build: BuildType) {
  dependency(build) {
    snapshot {
      onDependencyFailure = FailureAction.FAIL_TO_START
      onDependencyCancel = FailureAction.CANCEL
    }
    artifacts {
      artifactRules = "+:pages.zip!scripts/pages.json => api-references"
    }
  }
}
