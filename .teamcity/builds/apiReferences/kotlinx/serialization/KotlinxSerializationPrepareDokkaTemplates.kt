package builds.apiReferences.kotlinx.serialization

import BuildParams.KOTLINX_SERIALIZATION_ID
import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxSerializationPrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_SERIALIZATION_ID templates"
    description = "Builds API reference for Kotlinx Serialization"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_SERIALIZATION_ID-stage")
    }
})
