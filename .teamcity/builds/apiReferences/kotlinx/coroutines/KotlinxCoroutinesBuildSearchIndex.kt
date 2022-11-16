package builds.apiReferences.kotlinx.coroutines

import builds.apiReferences.dependsOnDokkaPagesJson
import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxCoroutinesBuildSearchIndex: BuildType({
  name = "Build search index for kotlinx.coroutines"

  templates(BuildApiReferenceSearchIndex)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.coroutines")
    param("env.API_REFERENCE_URL", "/api/kotlinx.coroutines")
  }

  dependencies {
    dependsOnDokkaPagesJson(KotlinxCoroutinesBuildApiReference)
  }
})