package builds.apiReferences.templates

import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object PrepareDokkaTemplate: Template({
  name = "Build Custom HTML Template"

  vcs {
    root(vcsRoots.KotlinLangOrg, """
      +:dokka-templates
      +:package.json
      +:.yarn.lock
      +:scripts/dokka/
    """.trimIndent())
  }

  artifactRules = "dokka-templates/** => dokka-templates"

  steps {
    script {
      name = "Fix npm sharp platform relatgied issue"
      scriptContent = """
        rm -rf node_modules/sharp
      """.trimIndent()
    }
    script {
      name = "Install dependencies"
      scriptContent = """
        yarn install --frozen-lockfile
      """.trimIndent()
      dockerImage = "node:16-alpine"
    }
    script {
      name = "Build Templates"
      scriptContent = """
        node ./scripts/dokka/generate-templates.js
      """.trimIndent()
      dockerImage = "node:16-alpine"
    }
  }

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
  }
})
