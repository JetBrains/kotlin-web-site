package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_ID
import builds.TemplateSearchIndex

object KotlinxMetadataJvmBuildSearchIndex : TemplateSearchIndex({
    name = "$KOTLINX_METADATA_ID search"
    description = "Build search index for Kotlinx Metadata JVM"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_METADATA_ID-stage")
    }

    dependencies {
        dependency(KotlinxMetadataJvmBuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$KOTLINX_METADATA_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
