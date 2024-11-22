package builds.apiReferences.kotlinx.serialization

import BuildParams.KOTLINX_SERIALIZATION_ID
import BuildParams.KOTLINX_SERIALIZATION_RELEASE_TAG
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.vcsRoots.KotlinxSerialization

object KotlinxSerializationBuildApiReference : BuildApiPages(
    apiId = KOTLINX_SERIALIZATION_ID, releaseTag = KOTLINX_SERIALIZATION_RELEASE_TAG, init = {
        vcs {
            root(KotlinxSerialization)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxSerializationPrepareDokkaTemplates)
        }
    })
