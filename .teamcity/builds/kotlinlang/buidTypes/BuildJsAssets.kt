package builds.kotlinlang.buidTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildJsAssets: BuildType({
  name = "Build site JS Assets"

  artifactRules = """
    _assets/** => assets.zip!_assets
    out/** => assets.zip!out
  """.trimIndent()

  vcs {
    root(vcsRoots.KotlinLangOrg)

    cleanCheckout = true
    showDependenciesChanges = true
  }

  steps {
    script {
      name = "Build assets"
      scriptContent = """
        #!/bin/bash
        set -e -x -u
        
        yarn install --frozen-lockfile
        
        NODE_ENV=production yarn run build
      """.trimIndent()
      dockerImage = "node:18.0.0"
      dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
      dockerPull = true
    }
  }

  dependencies {
    artifacts(FetchBlogNews) {
      buildRule = lastSuccessful(branch = "+:<default>")
      artifactRules = """
        +:latest-news.zip!** => latest-news/
      """.trimIndent()
      cleanDestination = true
    }
  }
})
