package builds.apiReferences.kotlinx.datetime

import BuildParams.KOTLINX_DATETIME_ID
import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxDatetimePrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_DATETIME_ID templates"
    description = "Build dokka templates for Kotlinx Datetime"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_DATETIME_ID")
    }
})
