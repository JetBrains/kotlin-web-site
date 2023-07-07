package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_JVM_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxMetadataJvmBuildApiReference : BuildType({
    name = "kotlinx-metadata-jvm API reference"

    templates(BuildApiReference)

    artifactRules = "libraries/kotlinx-metadata/jvm/build/dokka/** => pages.zip"

    params {
        param("release.tag", KOTLINX_METADATA_JVM_RELEASE_TAG)
        param("DOKKA_TEMPLATE_TASK", ":kotlinx-metadata-jvm:dokkaHtml -PkotlinxMetadataDeployVersion=${KOTLINX_METADATA_JVM_RELEASE_TAG}")
    }

    vcs {
        root(builds.apiReferences.vcsRoots.Kotlin)
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxMetadataJvmPrepareDokkaTemplates, "libraries/kotlinx-metadata/jvm/dokka-templates")
    }
})
