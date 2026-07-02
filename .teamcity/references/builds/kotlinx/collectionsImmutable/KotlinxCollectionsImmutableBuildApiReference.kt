package references.builds.kotlinx.collectionsImmutable

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_ID
import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_LABEL
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.scriptBuildHtml
import references.scriptDropSnapshot
import references.vcsRoots.KotlinxCollectionsImmutable

private const val DOKKA_HTML_RESULT = "core/build/dokka/html"

object KotlinxCollectionsImmutableBuildApiReference : BuildApiPages(
    apiId = KOTLINX_COLLECTIONS_IMMUTABLE_ID,
    releaseTag = KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_LABEL,
    pagesRoot = DOKKA_HTML_RESULT,
    stepDropSnapshot = {
        scriptDropSnapshot {
            // language=bash
            scriptContent = """
                #!/bin/bash
                sed -i -E "s/versionSuffix=SNAPSHOT//gi" ./gradle.properties
            """.trimIndent()
        }
    },
    stepBuildHtml = {
        scriptBuildHtml { tasks = ":kotlinx-collections-immutable:dokkaGenerate" }
    },
    init = {
        vcs {
            root(KotlinxCollectionsImmutable)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxCollectionsImmutablePrepareDokkaTemplates, "core/dokka-templates")
        }
    })
