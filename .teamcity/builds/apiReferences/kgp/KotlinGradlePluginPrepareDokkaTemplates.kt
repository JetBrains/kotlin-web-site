package builds.apiReferences.kgp

import BuildParams.KGP_ID
import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinGradlePluginPrepareDokkaTemplates : BuildType({
    name = "$KGP_ID templates"
    description = "Build Dokka Templates for Kotlin Gradle Plugin"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", "$KGP_ID")
    }
})
