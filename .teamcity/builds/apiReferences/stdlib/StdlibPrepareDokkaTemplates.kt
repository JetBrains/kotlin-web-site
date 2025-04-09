package builds.apiReferences.stdlib

import BuildParams.CORE_API_TITLE
import BuildParams.SEARCH_INDEX_NAME
import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

/**
 * It is used outside the configuration by stdlib builder.
 */
object StdlibPrepareDokkaTemplates : BuildType({
    name = "Core API templates"
    description = "Build Dokka Templates for Kotlin Core API"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", SEARCH_INDEX_NAME)
        param("env.DOKKA_CUSTOM_BODY", "core-api")
        param("env.DOKKA_FEEDBACK", "true")
        param("env.API_REFERENCE_NAME", CORE_API_TITLE)
    }
})
