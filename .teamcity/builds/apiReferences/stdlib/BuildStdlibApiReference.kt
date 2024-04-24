package builds.apiReferences.stdlib

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildStdlibApiReference : BuildType({
  name = "Stdlib Api reference"
  artifactRules = """
      +:content/** => latest-version.zip
      +:pages.json => ./
  """.trimIndent()

  steps {
      script {
          name = "Drop unnecessary files"
          // language=bash
          scriptContent = """
              ls -la ./
              ls -la ./content/
              ls -la ./content/all-libs/

              rm ./content/all-libs/not-found-version.html
              
              # empty pages.json
              mv ./content/all-libs/scripts/pages.json ./
              echo "[]" > ./content/all-libs/scripts/pages.json
          """.trimIndent()
      }
  }

  dependencies {
      dependency(AbsoluteId("Kotlin_KotlinRelease_1920_LibraryReferenceLatestDocs")) {
      snapshot {
        reuseBuilds = ReuseBuilds.SUCCESSFUL
        onDependencyFailure = FailureAction.FAIL_TO_START
      }
      artifacts {
        cleanDestination = true
        artifactRules = "+:latest-version.zip!** => content/"
      }
    }
  }
})
