package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_JVM_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.*
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinxMetadataJvmBuildApiReference : BuildType({
    name = "kotlinx-metadata-jvm API reference"

    templates(BuildApiReference)

    artifactRules = "libraries/kotlinx-metadata/jvm/build/dokka/** => pages.zip"

    params {
        param("release.tag", KOTLINX_METADATA_JVM_RELEASE_TAG)
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
        scriptDokkaVersionSync {
            scriptContent = """
                #!/bin/bash
                set -e
                set +x
                set -o pipefail
                set -u

                # update Dokka version
                sed -i -E "s/dokka ?= ?\"[0-9\.]+\"/dokka = \"1.9.0-dev-218\"/gi" ./gradle/libs.versions.toml
                
                # Define the replacement string
                replacement="maven(url = \"$DOKKA_SPACE_REPO\")\nmavenCentral"
                
                # List of kts files to apply the command on
                files=(
                  "./build.gradle.kts"
                  "./repo/gradle-settings-conventions/settings.gradle.kts"
                  "./repo/gradle-build-conventions/buildsrc-compat/build.gradle.kts"
                )
                
                # Loop through the files and apply the sed command
                for file in "${'$'}{files[@]}"; do
                    sed -i -E "s|mavenCentral|${'$'}replacement|" "${'$'}file"
                done
                
                # modify Groovy file
                sed -i -E "s|mavenCentral|maven \{ url \"$DOKKA_SPACE_REPO\" \}\nmavenCentral|" ./settings.gradle
                
                # add Dokka dev artifacts to the list of trusted ones
                sed -i -E "s|<trusted-artifacts>|<trusted-artifacts>\n<trust group=\"org.jetbrains.dokka\" />\n|" ./gradle/verification-metadata.xml
            """.trimIndent()
        }
        script {
            name = "build api reference"
            scriptContent = """
                ./gradlew :kotlinx-metadata-jvm:dokkaHtml -PkotlinxMetadataDeployVersion=${KOTLINX_METADATA_JVM_RELEASE_TAG}
            """.trimIndent()
        }
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxMetadataJvmPrepareDokkaTemplates, "libraries/kotlinx-metadata/jvm/dokka-templates")
    }
})
