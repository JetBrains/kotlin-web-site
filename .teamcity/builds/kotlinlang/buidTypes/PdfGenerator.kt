package builds.kotlinlang.buidTypes

import builds.SCRIPT_PATH
import builds.kotlinlang.templates.DockerImageBuilder
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object PdfGenerator : BuildType({
  name = "PDF Generator"
  description = "Build PDF reference https://kotlinlang.org/docs/"

  templates(DockerImageBuilder)

  artifactRules = """
      dist/docs/pdf.html
      pdf/kotlin-docs.pdf
  """.trimIndent()

  requirements {
    doesNotContain("docker.server.osType", "windows")
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
      name = "Generate PDF"
      //language=sh
      scriptContent = """
        ./scripts/pdf.sh
      """.trimIndent()
      dockerImage = "python:3.9"
    }
  }

  dependencies {
    dependency(BuildReferenceDocs) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:docs.zip!** => dist/docs/"
      }
    }
  }
})
