package kotlinlang.builds

import BuildParams.KLANG_NODE_CONTAINER
import jetbrains.buildServer.configs.kotlin.BuildType
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

  requirements {
    doesNotContain("docker.server.osType", "windows")
  }

  steps {
    script {
      name = "Build assets"
      scriptContent = """
        #!/bin/sh
        set -e -x -u
        
        yarn install --frozen-lockfile
        
        NODE_ENV=production yarn run build
      """.trimIndent()
      dockerImage = KLANG_NODE_CONTAINER
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
