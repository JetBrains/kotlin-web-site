package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.vcsRoots.WebHelp


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
    root(WebHelp, """
      +:webhelp
    """.trimIndent())
  }

  steps {
    script {
      // language=sh
      scriptContent = """
        PACKAGE_MANAGER_VERSION=$(node -e "console.log(JSON.parse(fs.readFileSync('./package.json').toString()).packageManager)")
        
        corepack enable
        corepack prepare "${'$'}PACKAGE_MANAGER_VERSION" --activate
        
        pnpm i --no-frozen-lockfile
        pnpm run build:kotlin
      """.trimIndent()
      workingDir = "webhelp"
      formatStderrAsError = true
      dockerImage = "node:18-alpine"
    }
  }

  requirements {
    equals("docker.server.osType", "linux")
  }
})
