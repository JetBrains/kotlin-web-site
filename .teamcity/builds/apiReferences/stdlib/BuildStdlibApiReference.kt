package builds.apiReferences.stdlib

import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildType

object BuildStdlibApiReference : BuildType({
  name = "Stdlib Api reference"

  artifactRules = "latest-version.zip"

  dependencies {
    artifacts(AbsoluteId("Kotlin_KotlinRelease_1820_LibraryReferenceLatestDocs")) {
      buildRule = lastPinned("+:*")
      cleanDestination = true
      artifactRules = "latest-version.zip"
    }
  }
})