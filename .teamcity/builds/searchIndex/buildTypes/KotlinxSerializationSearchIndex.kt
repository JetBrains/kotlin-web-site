package builds.searchIndex.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.ReuseBuilds

object KotlinxSerializationSearchIndex: BuildType({
  name = "Kotlinx.Serialization"

  templates(DokkaSearchIndexTemplate)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.serialization")
    param("env.API_REFERENCE_URL", "/api/kotlinx.serialization")
  }

  dependencies {
    dependency(builds.apiReferences.buildTypes.KotlinxSerialization) {
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