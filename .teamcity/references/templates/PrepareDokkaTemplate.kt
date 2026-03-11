package references.templates

import BuildParams.KLANG_NODE_CONTAINER
import jetbrains.buildServer.configs.kotlin.BuildTypeSettings
import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import vcsRoots.KotlinLangOrg

fun BuildTypeSettings.configureReferenceTemplate() {
  artifactRules = """
      dokka-templates/** => dokka-templates
  """.trimIndent()

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
  }

  steps {
    script {
      name = "Fix npm sharp platform related issue"
      scriptContent = """
        rm -rf node_modules/sharp
      """.trimIndent()
    }
    script {
      name = "Install dependencies"
      scriptContent = """
        yarn install --frozen-lockfile
      """.trimIndent()
      dockerImage = KLANG_NODE_CONTAINER
    }
    script {
      name = "Build Templates"
      scriptContent = """
        node ./scripts/dokka/generate-templates.js
      """.trimIndent()
      dockerImage = KLANG_NODE_CONTAINER
    }
  }
}

object PrepareDokkaTemplate : Template({
  configureReferenceTemplate()

  name = "Build Custom HTML Template"

  vcs {
    root(KotlinLangOrg)
  }
})
