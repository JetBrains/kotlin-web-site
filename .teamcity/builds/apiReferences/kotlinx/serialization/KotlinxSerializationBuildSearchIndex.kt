package builds.apiReferences.kotlinx.serialization

import builds.apiReferences.dependsOnDokkaPagesJson
import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxSerializationBuildSearchIndex: BuildType({
  name = "Build search index for kotlinx.serialization"

  templates(BuildApiReferenceSearchIndex)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.serialization")
    param("env.API_REFERENCE_URL", "/api/kotlinx.serialization")
  }

  dependencies {
    dependsOnDokkaPagesJson(KotlinxSerializationBuildApiReference)
  }
})