package kotlinlang.builds

import BuildParams.SEARCH_INDEX_NAME
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import references.builds.stdlib.BuildStdlibApiReference
import templates.TemplateSearchIndex

object BuildSearchIndex : TemplateSearchIndex({
    name = "kotlinlang.org search"
    description = "Build search index for kotlinlang.org"

    params {
        param("env.ALGOLIA_INDEX_NAME", SEARCH_INDEX_NAME)
    }

    triggers {
        schedule {
            schedulingPolicy = cron {
                hours = "3"
                dayOfMonth = "*/2"
            }
            branchFilter = "+:<default>"
            triggerBuild = always()
        }
    }

    dependencies {
        dependency(BuildSitePages) {
            snapshot {}
            artifacts {
                artifactRules = "+:pages.zip!** => dist"
                cleanDestination = true
            }
        }
        dependency(BuildStdlibApiReference) {
            snapshot {}
            artifacts {
                artifactRules = """
                    pages.zip!** => dist/api/core/
                """.trimIndent()
                cleanDestination = true
            }
        }
    }
})
