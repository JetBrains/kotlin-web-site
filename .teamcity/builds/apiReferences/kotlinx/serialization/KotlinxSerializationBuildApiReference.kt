package builds.apiReferences.kotlinx.serialization

import BuildParams.KOTLINX_SERIALIZATION_ID
import BuildParams.KOTLINX_SERIALIZATION_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.stdlib.copyDokkaFiles
import builds.apiReferences.stdlib.sitemapGenerate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxSerializationBuildApiReference : BuildType({
    name = "$KOTLINX_SERIALIZATION_ID pages"
    description = "Build pages for Kotlinx Serialization"

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

    steps {
        copyDokkaFiles(KOTLINX_SERIALIZATION_ID)
        sitemapGenerate(KOTLINX_SERIALIZATION_ID)
    }
})
