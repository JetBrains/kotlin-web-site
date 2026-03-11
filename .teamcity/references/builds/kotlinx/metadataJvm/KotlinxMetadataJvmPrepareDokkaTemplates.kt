package references.builds.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_ID
import BuildParams.KOTLINX_METADATA_TITLE
import jetbrains.buildServer.configs.kotlin.BuildType
import references.templates.PrepareDokkaTemplate

object KotlinxMetadataJvmPrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_METADATA_ID templates"
    description = "Build Dokka Templates for Kotlinx Metadata JVM"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", KOTLINX_METADATA_ID)
        param("env.API_REFERENCE_NAME", KOTLINX_METADATA_TITLE)
    }
})
