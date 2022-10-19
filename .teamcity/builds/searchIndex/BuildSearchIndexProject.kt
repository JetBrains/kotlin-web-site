package builds.searchIndex

import jetbrains.buildServer.configs.kotlin.Project

object BuildSearchIndexProject: Project({
  name = "Build Search Index"
  description = "Build Algolia search indexes for kotlinlang.org"

  buildType(builds.searchIndex.buildTypes.KotlinxCoroutinesSearchIndex)
  buildType(builds.searchIndex.buildTypes.KotlinxSerializationSearchIndex)

  template(builds.searchIndex.buildTypes.DokkaSearchIndexTemplate)
})