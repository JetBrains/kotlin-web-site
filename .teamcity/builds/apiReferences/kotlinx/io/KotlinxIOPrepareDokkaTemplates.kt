package builds.apiReferences.kotlinx.io

import BuildParams.KOTLINX_IO_ID
import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxIOPrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_IO_ID templates"
    description = "Build Dokka Templates for Kotlinx IO"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KOTLINX_IO_ID")
    }
})
