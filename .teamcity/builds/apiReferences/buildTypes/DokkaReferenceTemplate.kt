package builds.apiReferences.buildTypes

import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import jetbrains.buildServer.configs.kotlin.buildSteps.script


object DokkaReferenceTemplate : Template({
  name = "Dokka Reference Template"

  artifactRules = "build/dokka/htmlMultiModule/** => pages.zip"

  steps {
    script {
      name = "Drop SNAPSHOT word for deploy"
      scriptContent = """
                #!/bin/bash
                CURRENT_VERSION="$(sed -E s/^v?//g <<<%release.tag%)"
                sed -i -E "s/^version=.+(-SNAPSHOT)?/version=${'$'}CURRENT_VERSION/gi" ./gradle.properties
            """.trimIndent()
      dockerImage = "debian"
    }

    gradle {
      name = "Build dokka html"
      tasks = "dokkaHtmlMultiModule"
    }
  }

  requirements {
    contains("docker.server.osType", "linux")
  }

  params {
    param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
  }

  dependencies {
    dependency(PrepareCustomDokkaTemplates) {
      snapshot {
        onDependencyFailure = FailureAction.CANCEL
        onDependencyCancel = FailureAction.CANCEL
      }

      artifacts {
        artifactRules = "+:dokka-templates/** => dokka-templates"
      }
    }
  }
})
