package references.builds.kotlinx.serialization

import BuildParams.KOTLINX_SERIALIZATION_ID
import BuildParams.KOTLINX_SERIALIZATION_RELEASE_LABEL
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.scriptBuildHtml
import references.vcsRoots.KotlinxSerialization

object KotlinxSerializationBuildApiReference : BuildApiPages(
    apiId = KOTLINX_SERIALIZATION_ID,
    releaseTag = KOTLINX_SERIALIZATION_RELEASE_LABEL,
    pagesRoot = "build/dokka/html",
    init = {
        vcs {
            root(KotlinxSerialization)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxSerializationPrepareDokkaTemplates)
        }
    },
    stepBuildHtml = {
        scriptBuildHtml {
            tasks = ":dokkaGenerate"
        }
    })
