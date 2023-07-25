package builds.apiReferences.stdlib

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.BuildType

object BuildStdlibApiReference : BuildType({
  name = "Stdlib Api reference"

  artifactRules = "latest-version.zip"

  dependencies {
    dependency(AbsoluteId("Kotlin_BuildPlayground_Sirius_LibraryReferenceLatestDocs")) {
      snapshot {
        reuseBuilds = ReuseBuilds.SUCCESSFUL
        onDependencyFailure = FailureAction.FAIL_TO_START
      }
      artifacts {
        cleanDestination = true
        artifactRules = "latest-version.zip"
      }
    }
  }
})