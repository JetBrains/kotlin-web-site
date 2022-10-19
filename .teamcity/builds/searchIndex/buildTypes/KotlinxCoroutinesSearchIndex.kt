package builds.searchIndex.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.ReuseBuilds

object KotlinxCoroutinesSearchIndex: BuildType({
  name = "Kotlinx.Coroutines"

  templates(DokkaSearchIndexTemplate)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.coroutines")
    param("env.API_REFERENCE_URL", "/api/kotlinx.coroutines")
  }

  dependencies {
    dependency(builds.apiReferences.buildTypes.KotlinxCoroutines) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }

      artifacts {
        artifactRules = "+:pages.zip!scripts/pages.json => api-references"
      }
    }
  }
})