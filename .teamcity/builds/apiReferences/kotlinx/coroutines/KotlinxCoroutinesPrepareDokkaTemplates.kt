package builds.apiReferences.kotlinx.coroutines

import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxCoroutinesPrepareDokkaTemplates: BuildType({
  name = "Prepare dokka templates for kotlinx.coroutines"

  templates(PrepareDokkaTemplate)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.coroutines")
  }
})