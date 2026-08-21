package kotlinlang.builds

import BuildParams.KLANG_NODE_CONTAINER
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import templates.DockerImageBuilder

object PdfGenerator : BuildType({
  name = "PDF Generator"
  description = "Build PDF reference https://kotlinlang.org/docs/"

  templates(DockerImageBuilder)

  artifactRules = "assets/kotlin-reference.pdf"

  requirements {
    doesNotContain("docker.server.osType", "windows")
  }

  steps {
    script {
      id = "script-generate-pdf"
      name = "Generate PDF"
      //language=bash
      scriptContent = """
        #!/bin/sh
        set -e
        yarn install --frozen-lockfile
        cd scripts/dist && yarn install --frozen-lockfile && cd ../..
        yarn run generate-pdf
      """.trimIndent()
      dockerImage = KLANG_NODE_CONTAINER
    }
  }

  dependencies {
    dependency(BuildSitePages) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:pages.zip!** => ./"
      }
    }
  }
})
