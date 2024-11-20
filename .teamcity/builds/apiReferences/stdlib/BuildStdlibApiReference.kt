package builds.apiReferences.stdlib

import BuildParams.KOTLIN_CORE_API_BUILD_ID
import builds.scriptDistAnalyze
import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildStdlibApiReference : BuildType({
  name = "Core API reference"

    vcs {
        root(vcsRoots.KotlinLangOrg, """
          scripts/doindex/
        """.trimIndent())
    }

  artifactRules = """
      +:dist/api/core/** => pages.zip
      +:pages.json => ./
  """.trimIndent()

  steps {
      script {
          name = "Drop unnecessary files"
          // language=bash
          scriptContent = """
              rm ./dist/api/core/not-found-version.html
              
              # empty pages.json
              mv ./dist/api/core/scripts/pages.json ./
              echo "[]" > ./dist/api/core/scripts/pages.json
          """.trimIndent()
      }
      script {
          name = "Add no robots for older versions"
          workingDir = "dist/"
          //language=bash
          scriptContent = """
              #!/bin/sh
              find . -type f -path "*/api/*/older/*.html" -exec sed -i -E 's/(<head[^>]*>)/\1<meta name="robots" content="noindex, nofollow">/g' {} \;
          """.trimIndent()
          dockerImage = "alpine"
      }
      scriptDistAnalyze {
          enabled = false
          scriptContent += "\nmv sitemap.xml api/core/sitemap.xml"
      }
  }

  dependencies {
      dependency(AbsoluteId(KOTLIN_CORE_API_BUILD_ID)) {
          artifacts {
              buildRule = lastSuccessful()
              cleanDestination = true
              artifactRules = "latest-version.zip!all-libs/** => dist/api/core/"
          }
    }
  }
})
