package builds.apiReferences.kotlinx.metadataJvm

import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxMetadataJvmPrepareDokkaTemplates: BuildType({
  name = "Prepare dokka templates for kotlinx-metadata-jvm"

  templates(PrepareDokkaTemplate)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx-metadata-jvm")
  }
})
