package builds.apiReferences.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object PrepareCustomDokkaTemplates: BuildType({
  name = "Prepare Custom Dokka Templates"

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

  artifactRules = "dokka-templates/** => dokka-templates"

  steps {
    script {
      name = "Install dependencies"
      scriptContent = """
        yarn install --frozen-lockfile
      """.trimIndent()
      dockerImage = "node:14-alpine"
    }
    script {
      name = "Build Templates"
      scriptContent = """
        node ./scripts/dokka/generate-templates.js
      """.trimIndent()
      dockerImage = "node:14-alpine"
    }
  }

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
  }
})
