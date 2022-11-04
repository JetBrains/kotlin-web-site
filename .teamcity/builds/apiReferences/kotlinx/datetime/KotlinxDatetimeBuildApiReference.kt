package builds.apiReferences.kotlinx.datetime

import builds.apiReferences.dependsOnDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object KotlinxDatetimeBuildApiReference : BuildType({
  name = "kotlinx-datetime API reference"

  artifactRules = "core/build/dokka/html/** => pages.zip"

  steps {
    gradle {
      name = "Build dokka html"
      tasks = "dokkaHtml"
    }
  }

  requirements {
    contains("docker.server.osType", "linux")
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

  dependencies {
    dependsOnDokkaTemplate(KotlinxDatetimePrepareDokkaTemplates, "core/dokka-templates")
  }
})
