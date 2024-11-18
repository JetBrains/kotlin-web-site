package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_ID
import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxMetadataJvmPrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_METADATA_ID templates"
    description = "Build dokka templates for Kotlinx Metadata JVM"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_METADATA_ID-stage")
    }
})
