package builds.apiReferences.kotlinx.serialization

import BuildParams.KOTLINX_SERIALIZATION_ID
import builds.TemplateSearchIndex

object KotlinxSerializationBuildSearchIndex : TemplateSearchIndex({
    name = "$KOTLINX_SERIALIZATION_ID search"
    description = "Build search index for Kotlinx Serialization"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_SERIALIZATION_ID-stage")
    }

    dependencies {
        dependency(KotlinxSerializationBuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$KOTLINX_SERIALIZATION_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
