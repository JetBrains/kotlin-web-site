package kotlinlang.builds

import documentation.builds.KotlinWithCoroutines
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import templates.DockerImageBuilder
import templates.SCRIPT_PATH

object PdfGenerator : BuildType({
  name = "PDF Generator"
  description = "Build PDF reference https://kotlinlang.org/docs/"

  templates(DockerImageBuilder)

  artifactRules = """
    dist/** => dist.zip!
    docs/kr.tree => dist.zip
    pdf/kotlin-docs.pdf
  """.trimIndent()

  requirements {
    doesNotContain("docker.server.osType", "windows")
  }

  params {
    select("with-pdf", "false", options = listOf("true", "false"))
  }

  steps {
    script {
      id = "script-dist-pdf-html"
      name = "Generate pdf.html"
        //language=bash
        scriptContent = """
        #!/bin/sh
        set -e
        npm install
        npm run generate-pdf
      """.trimIndent()
      dockerImage = "node:22-alpine"
      workingDir = SCRIPT_PATH
    }
    script {
      conditions {
        equals("with-pdf", "true")
      }
      name = "Generate PDF"
      //language=sh
      scriptContent = "./scripts/pdf.sh"
      dockerImage = "python:3.9"
    }
  }

  dependencies {
    dependency(KotlinWithCoroutines) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = """
          +:webHelpImages.zip!** => dist/docs/images/
          +:webHelpKR2.zip!** => dist/docs/
        """.trimIndent()
      }
    }
  }
})
