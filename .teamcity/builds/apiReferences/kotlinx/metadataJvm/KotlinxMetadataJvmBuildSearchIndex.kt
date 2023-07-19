package builds.apiReferences.kotlinx.metadataJvm

import builds.apiReferences.dependsOnDokkaPagesJson
import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxMetadataJvmBuildSearchIndex: BuildType({
  name = "Build search index for kotlinx-metadata-jvm"

  templates(BuildApiReferenceSearchIndex)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx-metadata-jvm")
    param("env.API_REFERENCE_URL", "/api/kotlinx-metadata-jvm")
  }

  dependencies {
    dependsOnDokkaPagesJson(KotlinxMetadataJvmBuildApiReference)
  }
})
