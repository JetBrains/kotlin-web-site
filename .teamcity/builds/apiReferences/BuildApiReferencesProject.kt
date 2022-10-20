package builds.apiReferences

import jetbrains.buildServer.configs.kotlin.Project

object BuildApiReferencesProject : Project({
  name = "API References"
  description = "Build API references for kotlinlang.org/api"

  buildType(builds.apiReferences.buildTypes.KotlinxSerialization)
  buildType(builds.apiReferences.buildTypes.KotlinxCoroutines)

  vcsRoot(builds.apiReferences.vcsRoots.KotlinxSerialization)
  vcsRoot(builds.apiReferences.vcsRoots.KotlinxCoroutines)

  template(builds.apiReferences.buildTypes.BuildCustomHTMLTemplate)
  template(builds.apiReferences.buildTypes.DokkaReferenceTemplate)
})
