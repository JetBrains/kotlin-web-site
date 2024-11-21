package builds.apiReferences.kotlinx.coroutines

import BuildParams.KOTLINX_COROUTINES_ID
import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxCoroutinesPrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_COROUTINES_ID templates"
    description = "Build Dokka Templates for Kotlinx Coroutines"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_COROUTINES_ID")
    }
})
