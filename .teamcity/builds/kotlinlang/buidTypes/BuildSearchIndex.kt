package builds.kotlinlang.buidTypes

import BuildParams.SEARCH_APP_ID
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import vcsRoots.KotlinLangOrg

object BuildSearchIndex : BuildType({
  name = "Build Site Search Index"
  description = "Build search index for Algolia using Google Analytics data"

  artifactRules = """
      search-report/** => search-report.zip
  """.trimIndent()

  params {
//    param("env.WH_INDEX_NAME", SEARCH_INDEX_NAME)
    param("env.WH_SEARCH_USER", SEARCH_APP_ID)
    param("env.WH_SEARCH_KEY", "%ALGOLIA_WRITE_API_KEY%")
  }

  vcs {
    root(KotlinLangOrg)
    cleanCheckout = true
    showDependenciesChanges = true
  }

  steps {
    script {
      name = "Build and push search index"
      scriptContent = "node index.mjs"
      dockerImage = "node:22-alpine"
      workingDir = "scripts/doindex/"
      dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
      dockerPull = true
    }
  }

  triggers {
    schedule {
      schedulingPolicy = cron {
        hours = "3"
        dayOfMonth = "*/2"
      }
      branchFilter = "+:<default>"
      triggerBuild = always()
    }
  }

  dependencies {
    dependency(PageViews) {
      snapshot {}
      artifacts {
        artifactRules = """
          page_views_map.json => data/
        """.trimIndent()
      }
    }

    dependency(BuildSitePages) {
      snapshot {}
      artifacts {
        artifactRules = "+:pages.zip!** => dist"
      }
    }
  }
})
