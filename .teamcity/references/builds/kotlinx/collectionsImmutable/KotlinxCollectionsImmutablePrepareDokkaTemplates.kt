package references.builds.kotlinx.collectionsImmutable

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_ID
import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_TITLE
import jetbrains.buildServer.configs.kotlin.BuildType
import references.templates.PrepareDokkaTemplate

object KotlinxCollectionsImmutablePrepareDokkaTemplates : BuildType({
    name = "$KOTLINX_COLLECTIONS_IMMUTABLE_ID templates"
    description = "Build dokka templates for Kotlinx Collections Immutable"

    templates(PrepareDokkaTemplate)

    params {
        param("env.ALGOLIA_INDEX_NAME", KOTLINX_COLLECTIONS_IMMUTABLE_ID)
        param("env.API_REFERENCE_NAME", KOTLINX_COLLECTIONS_IMMUTABLE_TITLE)
    }
})
