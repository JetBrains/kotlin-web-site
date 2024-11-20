package builds.apiReferences.kotlinx.io

import BuildParams.KOTLINX_IO_ID
import builds.TemplateSearchIndex

object KotlinxIOBuildSearchIndex : TemplateSearchIndex({
    name = "$KOTLINX_IO_ID search"
    description = "Build search index for Kotlinx IO"

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_IO_ID")
    }

    dependencies {
        dependency(KotlinxIOBuildApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/$KOTLINX_IO_ID/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
