package builds.apiReferences.kotlinx.serialization

import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxSerializationPrepareDokkaTemplates: BuildType({
  name = "Prepare dokka templates for kotlinx.serialization"

  templates(PrepareDokkaTemplate)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.serialization")
  }
})