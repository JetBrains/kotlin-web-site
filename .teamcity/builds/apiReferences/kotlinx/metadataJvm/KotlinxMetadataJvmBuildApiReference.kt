package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_ID
import BuildParams.KOTLIN_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.*
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

private const val LIB_DIR = "libraries/kotlinx-metadata/jvm"

object KotlinxMetadataJvmBuildApiReference : BuildType({
    name = "$KOTLINX_METADATA_ID pages"
    description = "Build pages for Kotlinx Metadata JVM"

    templates(BuildApiReference)

    artifactRules = "$LIB_DIR/build/dokka/** => pages.zip"

    params {
        param("release.tag", KOTLIN_RELEASE_TAG)
    }

    triggers {
        vcsDefaultTrigger {
            enabled = false
        }
    }

    vcs {
        root(builds.apiReferences.vcsRoots.KotlinMetadataJvm)
    }

    steps {
        scriptDropSnapshot {
            enabled = false
        }
        buildDokkaHTML {
            enabled = false
        }
        script {
            name = "build api reference"
            scriptContent = """
                #!/bin/bash
                
                 set -e -u
                
                ./gradlew :kotlin-metadata-jvm:dokkaHtml -PdeployVersion=${KOTLIN_RELEASE_TAG.removePrefix("v")} --no-daemon --no-configuration-cache
            """.trimIndent()
        }
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxMetadataJvmPrepareDokkaTemplates, "$LIB_DIR/dokka-templates")
    }
})
