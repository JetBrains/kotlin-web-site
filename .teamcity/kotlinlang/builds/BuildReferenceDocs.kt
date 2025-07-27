package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import java.io.File
import java.nio.file.Paths

private fun readScript(name: String): String {
    val file = File(Paths.get("scripts/$name.mjs").toAbsolutePath().toString())
    return file.readText()
}

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
    param("WEBHELP_FRONTEND_VERSION", "6.24.0-api-nav")
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
    dependency(AbsoluteId("Documentation_TransitioningProducts_KotlinReferenceWithCoroutines")) {
      snapshot {}

      artifacts {
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
