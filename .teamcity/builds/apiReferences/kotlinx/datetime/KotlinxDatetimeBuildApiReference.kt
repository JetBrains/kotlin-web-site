package builds.apiReferences.kotlinx.datetime

import jetbrains.buildServer.configs.kotlin.BuildType

import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import builds.apiReferences.templates.scriptDokkaVersionSync
import builds.apiReferences.templates.scriptDropSnapshot

object KotlinxDatetimeBuildApiReference : BuildType({
  name = "kotlinx-datetime API reference"

  templates(BuildApiReference)

  artifactRules = "core/build/dokka/html/** => pages.zip"

  params {
    param("release.tag", BuildParams.KOTLINX_DATETIME_RELEASE_TAG)
    param("DOKKA_TEMPLATE_TASK", ":kotlinx-datetime:dokkaHtml")
  }

  steps {
    scriptDropSnapshot {
      scriptContent = """
        #!/bin/bash
        sed -i -E "s/versionSuffix=SNAPSHOT//gi" ./gradle.properties
      """.trimIndent()
    }

    scriptDokkaVersionSync {
      scriptContent += """
        sed -i -E "s|mavenCentral|maven(url = \"https://maven.pkg.jetbrains.space/kotlin/p/dokka/dev/\")\nmavenCentral|" ./settings.gradle.kts ./build.gradle.kts
      """
    }
  }

  vcs {
    root(builds.apiReferences.vcsRoots.KotlinxDatetime)
  }

  dependencies {
    dependsOnDokkaTemplate(KotlinxDatetimePrepareDokkaTemplates, "core/dokka-templates")
  }
})
