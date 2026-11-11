package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.vcsRoots.CmsPoc

object CmsPocSync : BuildType({
  name = "CMS PoC Sync"

  artifactRules = """
    cms-poc/data/** => cms.zip!data
    cms-poc/public/notion-assets/** => cms.zip!public/notion-assets
  """.trimIndent()

  params {
    param("env.NOTION_TOKEN_V2", "%NOTION_TOKEN_V2%")
    param("env.NOTION_USER_ID", "%NOTION_USER_ID%")
    param("env.NOTION_PAGE", "effbf30651628213a23b81fc8a079faa")
  }

  vcs {
    root(CmsPoc, "+:. => cms-poc")
  }

  steps {
    script {
      scriptContent = """
        set -eu
        umask 077
        trap 'rm -f token_v2.token notion_user.token' EXIT

        printf '%s' "${'$'}NOTION_TOKEN_V2" > token_v2.token
        if [ -n "${'$'}NOTION_USER_ID" ]; then
          printf '%s' "${'$'}NOTION_USER_ID" > notion_user.token
        else
          rm -f notion_user.token
        fi

        npm ci
        npm run sync "${'$'}NOTION_PAGE"
      """.trimIndent()
      workingDir = "cms-poc"
      dockerImage = "node:22-alpine"
      dockerPull = true
    }
  }

  requirements {
    doesNotContain("docker.server.osType", "windows")
  }
})