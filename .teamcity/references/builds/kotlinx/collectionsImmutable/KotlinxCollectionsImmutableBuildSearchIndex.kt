package references.builds.kotlinx.collectionsImmutable

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_ID
import templates.TemplateSearchIndex

object KotlinxCollectionsImmutableBuildSearchIndex : TemplateSearchIndex({
    name = "$KOTLINX_COLLECTIONS_IMMUTABLE_ID search"
    description = "Build search index for Kotlinx Collections Immutable"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_COLLECTIONS_IMMUTABLE_ID")
    }

    dependencies {
        dependency(KotlinxCollectionsImmutableBuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$KOTLINX_COLLECTIONS_IMMUTABLE_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
