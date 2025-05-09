package references.builds.kgp

import BuildParams.KGP_ID
import templates.TemplateSearchIndex

object KotlinGradlePluginBuildSearchIndex : TemplateSearchIndex(
    init = {
        name = "$KGP_ID search"
        description = "Build search index for Kotlinx Coroutines"

        params {
            param("env.ALGOLIA_INDEX_NAME", "$KGP_ID")
        }

        dependencies {
            dependency(KotlinGradlePluginBuildApiReference) {
                snapshot {}
                artifacts {
                    artifactRules = """
                            pages.zip!** => dist/api/$KGP_ID/
                        """.trimIndent()
                    cleanDestination = true
                }
            }
        }
    })
