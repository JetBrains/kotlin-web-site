package kotlinlang.builds

import common.extensions.isProjectPlayground
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object PdfGenerator : BuildType({
  name = "PDF Generator"
  description = "Build PDF reference https://kotlinlang.org/docs/"

  artifactRules = "assets/kotlin-reference.pdf"

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

  requirements {
    equals("node.js.nvm", "yes")
    contains("teamcity.agent.name", "-macos-")
  }

  triggers {
    finishBuildTrigger {
      buildType = BuildSitePages.id?.value ?: error("Invalid BuildSitePages ID")
      branchFilter = "+:<default>"
      successfulOnly = false
    }
  }

  steps {
    step {
      id = "jonnyzzz_nvm"
      type = "jonnyzzz.nvm"
      param("version", "20")
    }
    script {
      id = "script-generate-pdf"
      name = "Generate PDF"
      //language=bash
      scriptContent = """
        #!/bin/sh
        set -e

        if [ -s "${'$'}NVM_DIR/nvm.sh" ]; then
          \. "${'$'}NVM_DIR/nvm.sh"
          nvm install
          nvm use
        fi

        npm ci
        cd scripts/dist && npm install && cd ../..
        npm run generate-pdf
      """.trimIndent()
    }
  }

  dependencies {
    dependency(BuildSitePages) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:pages.zip!** => ./dist/"
      }
    }
  }
})
