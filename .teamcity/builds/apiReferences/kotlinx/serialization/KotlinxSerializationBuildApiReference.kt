package builds.apiReferences.kotlinx.serialization

import BuildParams.KOTLINX_SERIALIZATION_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxSerializationBuildApiReference : BuildType({
    name = "kotlinx.serialization API reference"

    templates(BuildApiReference)

    params {
        param("release.tag", KOTLINX_SERIALIZATION_RELEASE_TAG)
    }

    vcs {
        root(builds.apiReferences.vcsRoots.KotlinxSerialization)
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxSerializationPrepareDokkaTemplates)
    }
})
