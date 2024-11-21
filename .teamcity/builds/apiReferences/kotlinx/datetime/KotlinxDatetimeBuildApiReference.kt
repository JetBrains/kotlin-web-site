package builds.apiReferences.kotlinx.datetime

import BuildParams.KOTLINX_DATETIME_ID
import BuildParams.KOTLINX_DATETIME_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.stdlib.copyDokkaFiles
import builds.apiReferences.stdlib.sitemapGenerate
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.buildDokkaHTML
import builds.apiReferences.templates.scriptDropSnapshot
import jetbrains.buildServer.configs.kotlin.BuildType

private const val HTML_RESULT = "core/build/dokka/html"

object KotlinxDatetimeBuildApiReference : BuildType({
    name = "$KOTLINX_DATETIME_ID pages"
    description = "Build pages for Kotlinx Datetime"

    templates(BuildApiReference)

    artifactRules = "$HTML_RESULT/** => pages.zip"

    params {
        param("release.tag", KOTLINX_DATETIME_RELEASE_TAG)
    }

    vcs {
        root(builds.apiReferences.vcsRoots.KotlinxDatetime)
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxDatetimePrepareDokkaTemplates, "core/dokka-templates")
    }

    steps {
        scriptDropSnapshot {
            // language=bash
            scriptContent = """
                #!/bin/bash
                sed -i -E "s/versionSuffix=SNAPSHOT//gi" ./gradle.properties
            """.trimIndent()
        }
        buildDokkaHTML {
            tasks = ":kotlinx-datetime:dokkaHtml"
        }
        copyDokkaFiles(KOTLINX_DATETIME_ID, HTML_RESULT)
        sitemapGenerate(KOTLINX_DATETIME_ID)
    }
})
