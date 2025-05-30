package references.builds.kotlinx.datetime

import BuildParams.KOTLINX_DATETIME_ID
import BuildParams.KOTLINX_DATETIME_TITLE
import jetbrains.buildServer.configs.kotlin.BuildType
import references.templates.PrepareDokkaTemplate

object KotlinxDatetimePrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_DATETIME_ID templates"
    description = "Build dokka templates for Kotlinx Datetime"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", KOTLINX_DATETIME_ID)
        param("env.API_REFERENCE_NAME", KOTLINX_DATETIME_TITLE)
    }
})
