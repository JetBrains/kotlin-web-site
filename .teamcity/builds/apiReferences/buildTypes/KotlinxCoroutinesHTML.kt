package builds.apiReferences.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxCoroutinesHTML: BuildType({
  name = "kotlinx.coroutines HTML"

  templates(BuildCustomHTMLTemplate)

  params {
    param("env.ALGOLIA_INDEX_NAME", "kotlinx.coroutines")
  }
})