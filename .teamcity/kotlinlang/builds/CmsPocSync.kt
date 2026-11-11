package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.vcsRoots.CmsPoc

object CmsPocSync : BuildType({
  name = "CMS PoC Sync"

  artifactRules = "cms-poc/cms-out/** => cms.zip"

  params {
    param("env.NOTION_TOKEN_V2", "%NOTION_TOKEN_V2%")
    param("env.NOTION_USER_ID", "%NOTION_USER_ID%")
    param("env.NOTION_PAGES", "effbf30651628213a23b81fc8a079faa 40fc51971d4f80368a32d40bb9181e28")
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

        pages=$(printf '%s' "${'$'}NOTION_PAGES" | tr ',\n\t' '   ')
        set -f
        set -- ${'$'}pages
        if [ "${'$'}#" -eq 0 ]; then
          echo "NOTION_PAGES must contain at least one page URL or ID" >&2
          exit 1
        fi

        rm -rf cms-out
        mkdir -p cms-out
        for page do
          rm -rf data/pages public/notion-assets
          npm run sync "${'$'}page"

          root_id=$(node -p "require('./data/site.json').rootId")
          case "${'$'}root_id" in
            ''|*[!A-Za-z0-9_-]*)
              echo "Invalid rootId returned by sync: ${'$'}root_id" >&2
              exit 1
              ;;
          esac

          output_dir="cms-out/${'$'}root_id"
          rm -rf "${'$'}output_dir"
          mkdir -p "${'$'}output_dir"
          mv data "${'$'}output_dir/data"
          if [ -d public/notion-assets ]; then
            mkdir -p "${'$'}output_dir/public"
            mv public/notion-assets "${'$'}output_dir/public/notion-assets"
          fi
        done
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