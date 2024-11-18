package builds.apiReferences.kotlinx.datetime

import BuildParams.KOTLINX_DATETIME_ID
import builds.TemplateSearchIndex

object KotlinxDatetimeBuildSearchIndex : TemplateSearchIndex({
    name = "$KOTLINX_DATETIME_ID search"
    description = "Build search index for Kotlinx Datetime"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_DATETIME_ID-stage")
    }

    dependencies {
        dependency(KotlinxDatetimeBuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$KOTLINX_DATETIME_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
