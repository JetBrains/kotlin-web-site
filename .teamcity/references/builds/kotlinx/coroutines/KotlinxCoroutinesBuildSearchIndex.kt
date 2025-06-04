package references.builds.kotlinx.coroutines

import BuildParams.KOTLINX_COROUTINES_ID
import templates.TemplateSearchIndex

object KotlinxCoroutinesBuildSearchIndex : TemplateSearchIndex({
    name = "$KOTLINX_COROUTINES_ID search"
    description = "Build search index for Kotlinx Coroutines"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_COROUTINES_ID")
    }

    dependencies {
        dependency(KotlinxCoroutinesBuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$KOTLINX_COROUTINES_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
