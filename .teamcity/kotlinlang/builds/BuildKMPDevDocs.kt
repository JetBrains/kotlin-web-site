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

object BuildKmpDevDocs : BuildType({
  name = "KMP dev Docs"
  description = "Build documentation pages https://kotlinlang.org/docs/kotlin-multiplatform-dev"

  vcs {
    root(vcsRoots.KotlinLangOrg)

    cleanCheckout = true
    showDependenciesChanges = true
  }

  artifactRules = """
      +:kotlin-multiplatform-dev/images => kotlin-multiplatform-dev.zip!images
      +:webhelp => kotlin-multiplatform-dev.zip!static
      +:kotlin-multiplatform-dev/pages/*.html => kotlin-multiplatform-dev.zip
      +:kotlin-multiplatform-dev/pages/*.json => kotlin-multiplatform-dev.zip
  """.trimIndent()

  params {
    param("WEBHELP_FRONTEND_VERSION", "6.22.0-fix-mermaid")
    param("WH_DOCS_PATH_REGEX", "docs/kotlin-multiplatform-dev")
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

    artifacts(BuildWebHelpFrontend) {
      buildRule = lastPinned("+:*")
      cleanDestination = true
      artifactRules = "+:static.zip!** => webhelp/v3"
    }
  }
})
