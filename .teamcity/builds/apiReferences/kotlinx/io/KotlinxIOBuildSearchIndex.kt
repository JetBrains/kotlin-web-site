package builds.apiReferences.kotlinx.io

import builds.apiReferences.dependsOnDokkaPagesJson
import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxIOBuildSearchIndex: BuildType({
  name = "Build search index for kotlinx-io"

  templates(BuildApiReferenceSearchIndex)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx-io")
    param("env.API_REFERENCE_URL", "/api/kotlinx-io")
  }

  dependencies {
    dependsOnDokkaPagesJson(KotlinxIOBuildApiReference)
  }
})
