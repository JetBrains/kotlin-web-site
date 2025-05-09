package templates

import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.buildFeatures.dockerSupport
import kotlinlang.builds.BuildKotlinGrammar

object DockerImageBuilder : Template({
  name = "Site builder docker container"

  artifactRules = "build/** => site.zip"

  params {
    param("virtualenv.folder", "_environment")
  }

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

  features {
    dockerSupport {
      loginToRegistry = on {
        dockerRegistryId = "PROJECT_EXT_357"
      }
    }
  }

  dependencies {
    snapshot(AbsoluteId("Kotlin_KotlinSites_Builds_KotlinlangOrg_BuildPythonContainer")) {
      onDependencyFailure = FailureAction.FAIL_TO_START
      onDependencyCancel = FailureAction.CANCEL
    }

    dependency(BuildKotlinGrammar) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }

      artifacts {
        artifactRules = "grammar.xml"
      }
    }
  }
})
