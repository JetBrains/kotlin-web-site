package builds.apiReferences

import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildApiReference
import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildSearchIndex
import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesPrepareDokkaTemplates
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimeBuildApiReference
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimeBuildSearchIndex
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimePrepareDokkaTemplates
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildApiReference
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildSearchIndex
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationPrepareDokkaTemplates
import builds.apiReferences.kotlinx.metadataJvm.KotlinxMetadataJvmBuildApiReference
import builds.apiReferences.kotlinx.metadataJvm.KotlinxMetadataJvmBuildSearchIndex
import builds.apiReferences.kotlinx.metadataJvm.KotlinxMetadataJvmPrepareDokkaTemplates
import builds.apiReferences.stdlib.BuildStdlibApiReference
import builds.apiReferences.stdlib.StdlibPrepareDokkaTemplates
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import builds.apiReferences.templates.PrepareDokkaTemplate
import builds.apiReferences.vcsRoots.KotlinxCoroutines
import builds.apiReferences.vcsRoots.KotlinxSerialization
import builds.apiReferences.vcsRoots.KotlinxDatetime
import builds.apiReferences.vcsRoots.KotlinMetadataJvm
import jetbrains.buildServer.configs.kotlin.Project

object BuildApiReferencesProject : Project({
  name = "API References"
  description = "Build API references for kotlinlang.org"

  buildType(KotlinxDatetimeBuildApiReference)
  buildType(KotlinxDatetimeBuildSearchIndex)
  buildType(KotlinxDatetimePrepareDokkaTemplates)

  buildType(KotlinxSerializationBuildApiReference)
  buildType(KotlinxSerializationBuildSearchIndex)
  buildType(KotlinxSerializationPrepareDokkaTemplates)

  buildType(KotlinxCoroutinesBuildApiReference)
  buildType(KotlinxCoroutinesBuildSearchIndex)
  buildType(KotlinxCoroutinesPrepareDokkaTemplates)

  buildType(KotlinxMetadataJvmBuildApiReference)
  buildType(KotlinxMetadataJvmBuildSearchIndex)
  buildType(KotlinxMetadataJvmPrepareDokkaTemplates)

  buildType(BuildStdlibApiReference)
  buildType(StdlibPrepareDokkaTemplates)

  vcsRoot(KotlinxSerialization)
  vcsRoot(KotlinxCoroutines)
  vcsRoot(KotlinxDatetime)
  vcsRoot(KotlinMetadataJvm)

  template(PrepareDokkaTemplate)
  template(BuildApiReference)
  template(BuildApiReferenceSearchIndex)
})
