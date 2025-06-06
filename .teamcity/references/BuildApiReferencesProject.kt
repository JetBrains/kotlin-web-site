package references

import BuildParams.API_COMPOSE
import BuildParams.KGP_REFERENCE
import jetbrains.buildServer.configs.kotlin.Project
import references.builds.kgp.KotlinGradlePluginBuildApiReference
import references.builds.kgp.KotlinGradlePluginBuildSearchIndex
import references.builds.kgp.KotlinGradlePluginPrepareDokkaTemplates
import references.builds.kotlinx.coroutines.KotlinxCoroutinesBuildApiReference
import references.builds.kotlinx.coroutines.KotlinxCoroutinesBuildSearchIndex
import references.builds.kotlinx.coroutines.KotlinxCoroutinesPrepareDokkaTemplates
import references.builds.kotlinx.datetime.KotlinxDatetimeBuildApiReference
import references.builds.kotlinx.datetime.KotlinxDatetimeBuildSearchIndex
import references.builds.kotlinx.datetime.KotlinxDatetimePrepareDokkaTemplates
import references.builds.kotlinx.io.KotlinxIOBuildApiReference
import references.builds.kotlinx.io.KotlinxIOBuildSearchIndex
import references.builds.kotlinx.io.KotlinxIOPrepareDokkaTemplates
import references.builds.kotlinx.metadataJvm.KotlinxMetadataJvmBuildApiReference
import references.builds.kotlinx.metadataJvm.KotlinxMetadataJvmBuildSearchIndex
import references.builds.kotlinx.metadataJvm.KotlinxMetadataJvmPrepareDokkaTemplates
import references.builds.kotlinx.serialization.KotlinxSerializationBuildApiReference
import references.builds.kotlinx.serialization.KotlinxSerializationBuildSearchIndex
import references.builds.kotlinx.serialization.KotlinxSerializationPrepareDokkaTemplates
import references.builds.stdlib.BuildStdlibApiReference
import references.builds.stdlib.StdlibPrepareDokkaTemplates
import references.templates.PrepareDokkaTemplate
import references.vcsRoots.*

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

    template(PrepareDokkaTemplate)

    subProject(API_COMPOSE.project)
    subProject(KGP_REFERENCE.project)
})
