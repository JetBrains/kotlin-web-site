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
        root(builds.apiReferences.vcsRoots.Kotlin)
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

                sed -i -E "s/dokka ?= ?\"[0-9\.]+\"/dokka = \"%DOKKA_TEMPLATES_VERSION%\"/gi" ./gradle/libs.versions.toml
                
                sed -i -E "s|mavenCentral|maven(url = \"$DOKKA_SPACE_REPO\")\nmavenCentral|" ./build.gradle.kts
                sed -i -E "s|mavenCentral|maven(url = \"$DOKKA_SPACE_REPO\")\nmavenCentral|" ./repo/gradle-settings-conventions/settings.gradle.kts
                sed -i -E "s|mavenCentral|maven(url = \"$DOKKA_SPACE_REPO\")\nmavenCentral|" ./repo/gradle-build-conventions/buildsrc-compat/build.gradle.kts
                sed -i -E "s|mavenCentral|maven \{ url \"$DOKKA_SPACE_REPO\" \}\nmavenCentral|" ./settings.gradle
                
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
