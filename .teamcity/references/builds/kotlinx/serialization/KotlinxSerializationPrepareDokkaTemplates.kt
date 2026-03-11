package references.builds.kotlinx.serialization

import BuildParams.KOTLINX_SERIALIZATION_ID
import BuildParams.KOTLINX_SERIALIZATION_TITLE
import jetbrains.buildServer.configs.kotlin.BuildType
import references.templates.PrepareDokkaTemplate

object KotlinxSerializationPrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_SERIALIZATION_ID templates"
    description = "Builds Dokka Templates for Kotlinx Serialization"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", KOTLINX_SERIALIZATION_ID)
        param("env.API_REFERENCE_NAME", KOTLINX_SERIALIZATION_TITLE)
    }
})
