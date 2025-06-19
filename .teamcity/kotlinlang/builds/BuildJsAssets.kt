package kotlinlang.builds

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
        #!/bin/bash
        set -e -x -u
        
        # for node:18 we caught exception:
        #   unhandledRejection TypeError: Failed to parse URL from /mnt/agent/work/75f6fbaeb8c41e25/node_modules/@wasm-codecs/mozjpeg/lib/mozjpeg.wasm
        #   at Object.fetch (node:internal/deps/undici/undici:11730:11) {
        #   [cause]: TypeError: Invalid URL
        export NODE_OPTIONS=--no-experimental-fetch
        
        yarn install --frozen-lockfile
        
        NODE_ENV=production yarn run build
      """.trimIndent()
      dockerImage = "node:lts-slim"
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
