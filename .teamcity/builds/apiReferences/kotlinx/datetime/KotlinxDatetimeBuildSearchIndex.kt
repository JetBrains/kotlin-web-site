package builds.apiReferences.kotlinx.datetime

import builds.apiReferences.dependsOnDokkaPagesJson
import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxDatetimeBuildSearchIndex: BuildType({
  name = "Build search index for kotlinx-datetime"

  templates(BuildApiReferenceSearchIndex)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx-datetime")
    param("env.API_REFERENCE_URL", "/api/kotlinx-datetime")
  }

  dependencies {
    dependsOnDokkaPagesJson(KotlinxDatetimeBuildApiReference)
  }
})
