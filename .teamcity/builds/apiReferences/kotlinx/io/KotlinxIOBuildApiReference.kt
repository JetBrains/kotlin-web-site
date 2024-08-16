package builds.apiReferences.kotlinx.io

import BuildParams.KOTLINX_IO_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.buildDokkaHTML
import builds.apiReferences.templates.scriptDropSnapshot
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxIOBuildApiReference : BuildType({
    name = "kotlinx-io API reference"

    templates(BuildApiReference)

    artifactRules = "core/build/dokka/html/** => pages.zip"

    params {
        param("release.tag", KOTLINX_IO_RELEASE_TAG)
    }

    vcs {
        root(builds.apiReferences.vcsRoots.KotlinxIO)
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxIOPrepareDokkaTemplates, "core/dokka-templates")
    }

    steps {
        scriptDropSnapshot {
            scriptContent = """
            #!/bin/bash
            sed -i -E "s/versionSuffix=SNAPSHOT//gi" ./gradle.properties
            """.trimIndent()
        }
        buildDokkaHTML {
            tasks = ":kotlinx-io:dokkaHtmlMultiModule"
        }
    }
})
