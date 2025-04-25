package builds.kotlinlang.buidTypes

import builds.kotlinlang.vcs.WebHelp
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script


object BuildWebHelpFrontend : BuildType({
  name = "Webhelp Frontend"

  artifactRules = """
        build/** => static.zip
        -:build/*.map=>static.zip
    """.trimIndent()

  params {
    param("env.WEBTEAM_UI_NPM_TOKEN", "%WEBTEAM_UI_NPM_TOKEN%")
  }

  vcs {
    root(WebHelp)
  }

  steps {
    script {
      scriptContent = """
        corepack enable
        corepack prepare pnpm@latest --activate
        
        pnpm i --no-frozen-lockfile
        pnpm run build:kotlin
      """.trimIndent()
      formatStderrAsError = true
      dockerImage = "node:18-alpine"
    }
  }

  requirements {
    equals("docker.server.osType", "linux")
  }
})
