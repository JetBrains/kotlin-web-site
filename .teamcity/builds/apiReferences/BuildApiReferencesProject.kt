package builds.apiReferences

import BuildParams.KGP_REFERENCE
import builds.apiReferences.kgp.KotlinGradlePluginBuildApiReference
import builds.apiReferences.kgp.KotlinGradlePluginBuildSearchIndex
import builds.apiReferences.kgp.KotlinGradlePluginPrepareDokkaTemplates
import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildApiReference
import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildSearchIndex
import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesPrepareDokkaTemplates
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimeBuildApiReference
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimeBuildSearchIndex
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimePrepareDokkaTemplates
import builds.apiReferences.kotlinx.io.KotlinxIOBuildApiReference
import builds.apiReferences.kotlinx.io.KotlinxIOBuildSearchIndex
import builds.apiReferences.kotlinx.io.KotlinxIOPrepareDokkaTemplates
import builds.apiReferences.kotlinx.metadataJvm.KotlinxMetadataJvmBuildApiReference
import builds.apiReferences.kotlinx.metadataJvm.KotlinxMetadataJvmBuildSearchIndex
import builds.apiReferences.kotlinx.metadataJvm.KotlinxMetadataJvmPrepareDokkaTemplates
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildApiReference
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildSearchIndex
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationPrepareDokkaTemplates
import builds.apiReferences.stdlib.BuildStdlibApiReference
import builds.apiReferences.stdlib.StdlibPrepareDokkaTemplates
import builds.apiReferences.templates.PrepareDokkaTemplate
import builds.apiReferences.vcsRoots.*
import jetbrains.buildServer.configs.kotlin.Project

object BuildApiReferencesProject : Project({
    name = "API References"
    description = "Build API references for kotlinlang.org"

    buildType(KotlinxDatetimeBuildApiReference)
    buildType(KotlinxDatetimeBuildSearchIndex)
    buildType(KotlinxDatetimePrepareDokkaTemplates)

    buildType(KotlinxIOBuildApiReference)
    buildType(KotlinxIOBuildSearchIndex)
    buildType(KotlinxIOPrepareDokkaTemplates)

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

    buildType(KotlinGradlePluginBuildApiReference)
    buildType(KotlinGradlePluginBuildSearchIndex)
    buildType(KotlinGradlePluginPrepareDokkaTemplates)

    vcsRoot(KotlinxSerialization)
    vcsRoot(KotlinxCoroutines)
    vcsRoot(KotlinxDatetime)
    vcsRoot(KotlinxIO)
    vcsRoot(Kotlin)
    vcsRoot(KotlinKGP)

    subProject(KGP_REFERENCE.project)

    template(PrepareDokkaTemplate)
})
