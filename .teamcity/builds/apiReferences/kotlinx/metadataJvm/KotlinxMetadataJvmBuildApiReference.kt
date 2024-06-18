package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLIN_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.*
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

private const val LIB_DIR = "libraries/kotlinx-metadata/jvm"

object KotlinxMetadataJvmBuildApiReference : BuildType({
    name = "kotlinx-metadata-jvm API reference"

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
                
                ./gradlew :kotlin-metadata-jvm:dokkaHtml -PdefaultSnapshotVersion=${KOTLIN_RELEASE_TAG.startsWith("v")} --no-daemon --no-configuration-cache
            """.trimIndent()
        }
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxMetadataJvmPrepareDokkaTemplates, "$LIB_DIR/dokka-templates")
    }
})
