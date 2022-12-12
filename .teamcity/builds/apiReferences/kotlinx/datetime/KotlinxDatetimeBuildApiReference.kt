package builds.apiReferences.kotlinx.datetime

import builds.apiReferences.dependsOnDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object KotlinxDatetimeBuildApiReference : BuildType({
  name = "kotlinx-datetime API reference"

  artifactRules = "core/build/dokka/html/** => pages.zip"

  steps {
    script {
      name = "Drop SNAPSHOT word for deploy"
      scriptContent = """
                #!/bin/bash
                sed -i -E "s/versionSuffix=SNAPSHOT//gi" ./gradle.properties
            """.trimIndent()
      dockerImage = "debian"
    }
    gradle {
      name = "Build dokka html"
      tasks = ":kotlinx-datetime:dokkaHtml"
      useGradleWrapper = true
    }
  }

  params {
    param("release.tag", BuildParams.KOTLINX_DATETIME_RELEASE_TAG)
    param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
  }

  vcs {
    root(builds.apiReferences.vcsRoots.KotlinxDatetime)
  }

  triggers {
    vcs {
      branchFilter = "+:<default>"
    }
  }

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
  }

  dependencies {
    dependsOnDokkaTemplate(KotlinxDatetimePrepareDokkaTemplates, "core/dokka-templates")
  }
})
