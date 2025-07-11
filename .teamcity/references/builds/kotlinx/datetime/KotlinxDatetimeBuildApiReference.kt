package references.builds.kotlinx.datetime

import BuildParams.KOTLINX_DATETIME_ID
import BuildParams.KOTLINX_DATETIME_RELEASE_LABEL
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.scriptBuildHtml
import references.scriptDropSnapshot
import references.vcsRoots.KotlinxDatetime

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
        scriptBuildHtml { tasks = ":kotlinx-datetime:dokkaGenerate" }
    },
    init = {
        vcs {
            root(KotlinxDatetime)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxDatetimePrepareDokkaTemplates, "core/dokka-templates")
        }
    })
