package builds.apiReferences.kotlinx.datetime

import BuildParams.KOTLINX_DATETIME_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.scriptDokkaVersionSync
import builds.apiReferences.templates.scriptDropSnapshot
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxDatetimeBuildApiReference : BuildType({
    name = "kotlinx-datetime API reference"

    templates(BuildApiReference)

    artifactRules = "core/build/dokka/html/** => pages.zip"

    params {
        param("release.tag", KOTLINX_DATETIME_RELEASE_TAG)
        param("DOKKA_TEMPLATE_TASK", ":kotlinx-datetime:dokkaHtml")
    }

    vcs {
        root(builds.apiReferences.vcsRoots.KotlinxDatetime)
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxDatetimePrepareDokkaTemplates, "core/dokka-templates")
    }

    steps {
        scriptDropSnapshot {
            scriptContent = """
            #!/bin/bash
            sed -i -E "s/versionSuffix=SNAPSHOT//gi" ./gradle.properties
            """.trimIndent()
        }
    }
})
