package builds.apiReferences

import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildApiReference
import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildSearchIndex
import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesPrepareDokkaTemplates
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildApiReference
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildSearchIndex
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationPrepareDokkaTemplates
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import builds.apiReferences.templates.PrepareDokkaTemplate
import builds.apiReferences.vcsRoots.KotlinxCoroutines
import builds.apiReferences.vcsRoots.KotlinxSerialization
import jetbrains.buildServer.configs.kotlin.Project

object BuildApiReferencesProject : Project({
  name = "API References"
  description = "Build API references for kotlinlang.org"

  buildType(KotlinxSerializationBuildApiReference)
  buildType(KotlinxSerializationBuildSearchIndex)
  buildType(KotlinxSerializationPrepareDokkaTemplates)

  buildType(KotlinxCoroutinesBuildApiReference)
  buildType(KotlinxCoroutinesBuildSearchIndex)
  buildType(KotlinxCoroutinesPrepareDokkaTemplates)

  vcsRoot(KotlinxSerialization)
  vcsRoot(KotlinxCoroutines)

  template(PrepareDokkaTemplate)
  template(BuildApiReference)
  template(BuildApiReferenceSearchIndex)
})
