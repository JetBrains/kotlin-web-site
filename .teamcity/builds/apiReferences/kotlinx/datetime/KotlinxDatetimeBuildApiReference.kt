package builds.apiReferences.kotlinx.datetime

import BuildParams.KOTLINX_DATETIME_ID
import BuildParams.KOTLINX_DATETIME_RELEASE_LABEL
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.scriptBuildHtml
import builds.apiReferences.scriptDropSnapshot
import builds.apiReferences.vcsRoots.KotlinxDatetime

private const val DOKKA_HTML_RESULT = "core/build/dokka/html"

object KotlinxDatetimeBuildApiReference : BuildApiPages(
    apiId = KOTLINX_DATETIME_ID,
    releaseTag = KOTLINX_DATETIME_RELEASE_LABEL,
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
        scriptBuildHtml { tasks = ":kotlinx-datetime:dokkaHtml" }
    },
    init = {
        vcs {
            root(KotlinxDatetime)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxDatetimePrepareDokkaTemplates, "core/dokka-templates")
        }
    })
