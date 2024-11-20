package builds.apiReferences.kotlinx.io

import BuildParams.KOTLINX_IO_ID
import BuildParams.KOTLINX_IO_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.buildDokkaHTML
import builds.apiReferences.templates.scriptDokkaVersionSync
import builds.apiReferences.templates.scriptDropSnapshot
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinxIOBuildApiReference : BuildType({
    name = "$KOTLINX_IO_ID pages"
    description = "Build pages for Kotlinx IO"

    templates(BuildApiReference)

    artifactRules = "build/dokka/htmlMultiModule/** => pages.zip"

    params {
        param("release.tag", KOTLINX_IO_RELEASE_TAG.removePrefix("v"))
    }

    vcs {
        root(builds.apiReferences.vcsRoots.KotlinxIO)
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxIOPrepareDokkaTemplates)
    }

    steps {
        scriptDropSnapshot {}
        scriptDokkaVersionSync {
            enabled = false // TODO readme, and disable this step for other libs too
        }
        buildDokkaHTML {
            enabled = false // TODO add useGradlewWrapper = true
        }
        script {
            name = "build api reference"
            scriptContent = """
                #!/bin/bash
                
                 set -e -u
                
                ./gradlew dokkaHtmlMultiModule --no-daemon --no-configuration-cache
            """.trimIndent()
        }
    }
})
