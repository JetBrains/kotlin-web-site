package builds.apiReferences.kotlinx.metadataJvm

import BuildParams.KOTLINX_METADATA_JVM_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.buildDokkaHTML
import builds.apiReferences.templates.scriptDropSnapshot
import builds.apiReferences.templates.vcsDefaultTrigger
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
