package builds.apiReferences.templates

import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildApiReferenceSearchIndex : Template({
  name = "Dokka Search Index Template"

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

  steps {
    script {
      name = "Install npm dependencies"
      scriptContent = "yarn install --frozen-lockfile"
      dockerImage = "node:16-alpine"
    }
    script {
      name = "Build Search Index"
      scriptContent = "node ./scripts/search/index.js"
      dockerImage = "node:16-alpine"
    }
  }

  params {
    param("env.ALGOLIA_APP_ID", "7961PKYRXV")
    param("env.ALGOLIA_WRITE_API_KEY", "%ALGOLIA_WRITE_API_KEY%")
    param("env.REFERENCE_INDEX_FILE_PATH", "api-references/pages.json")
  }

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
  }

//  triggers {
//    schedule {
//      schedulingPolicy = cron {
//        hours = "3"
//        dayOfMonth = "*/2"
//      }
//      branchFilter = "+:<default>"
//      triggerBuild = always()
//    }
//  }
})