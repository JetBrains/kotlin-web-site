package templates

import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.Template
import jetbrains.buildServer.configs.kotlin.buildFeatures.dockerRegistryConnections
import kotlinlang.builds.BuildKotlinGrammar
import kotlinlang.builds.BuildPythonContainer

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
    dockerRegistryConnections {
      loginToRegistry = on {
        dockerRegistryId = "PROJECT_EXT_357"
      }
    }
  }

  dependencies {
    snapshot(BuildPythonContainer) {
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

