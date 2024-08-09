package builds.kotlinlang.buidTypes

import jetbrains.buildServer.configs.kotlin.BuildType

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildReferenceDocs : BuildType({
  name = "Reference Docs"
  description = "Build documentation pages https://kotlinlang.org/docs/"

  artifactRules = """
      +:images => docs.zip!images
      +:static => docs.zip!static
      +:pages/*.html => docs.zip
      +:pages/*.json => docs.zip
  """.trimIndent()

  params {
    param("WEBHELP_FRONTEND_VERSION", "6.11.0-footer")
    param("WH_DOCS_PATH_REGEX", "docs")
    param("WH_PROJECT_NAME", "kotlin-reference")
  }

  steps {
    script {
      name = "Fix paths"
      scriptContent = """
          find pages -type f -name '*.html' -exec sed -i -E 's/((https?:)?\/\/resources.jetbrains.com)?\/storage\/help-app\/v[0-9]\//static\/v3\//g' {} +
          find pages -type f -name '*.html' -exec sed -i -E "s/((https?:)?\/\/resources.jetbrains.com)?\/help\/app\//static\//g" {} +
          
          find pages -type f -name '*.html' -exec sed -i -E "s/(static\/v3\/app.css)/\1?v=%WEBHELP_FRONTEND_VERSION%/g" {} +
      """.trimIndent()
      dockerImage = "alpine"
      dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
    }
  }

  dependencies {
    dependency(AbsoluteId("Documentation_TransitioningProducts_KotlinReferenceWithCoroutinesWrs")) {
      snapshot {}

      artifacts {
        buildRule = build("62")
        cleanDestination = true
        artifactRules = """
            +:webHelpImages.zip!** => images/
            +:webHelpKR2.zip!** => pages/
        """.trimIndent()
      }
    }
    artifacts(BuildWebHelpFrontend) {
      buildRule = lastPinned("+:*")
      cleanDestination = true
      artifactRules = "+:static.zip!** => static/v3"
    }
  }
})
