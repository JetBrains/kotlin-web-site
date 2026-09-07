package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script

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
        
        YARN_HOME=""

        cleanup() {
          if [ -n "${'$'}{'$'}YARN_HOME" ] && [ -d "${'$'}{'$'}YARN_HOME" ]; then
            echo "Removing temporary yarn installation: ${'$'}{'$'}YARN_HOME"
            rm -rf "${'$'}{'$'}YARN_HOME"
          fi
        }

        trap cleanup EXIT INT TERM
        
        if [ -s "${'$'}NVM_DIR/nvm.sh" ]; then
          \. "${'$'}NVM_DIR/nvm.sh"
          nvm install
          nvm use
        fi
        
        if ! command -v yarn >/dev/null 2>&1; then
          YARN_HOME="$(mktemp -d)"
          npm install --no-save --prefix "${'$'}YARN_HOME" yarn
          export PATH="${'$'}YARN_HOME/node_modules/.bin:${'$'}PATH"
        fi
        
        yarn install --frozen-lockfile
        cd scripts/dist && yarn install --frozen-lockfile && cd ../..
        yarn run generate-pdf
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
