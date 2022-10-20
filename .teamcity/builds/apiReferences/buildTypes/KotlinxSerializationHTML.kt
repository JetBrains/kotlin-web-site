package builds.apiReferences.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxSerializationHTML: BuildType({
  name = "kotlinx.serialization HTML"

  templates(BuildCustomHTMLTemplate)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.serialization")
  }
})