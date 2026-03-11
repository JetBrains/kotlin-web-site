package tests.buildTypes

import common.E2ERunner
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.builds.BuildSitePages

object E2ETests : E2ERunner({
    name = "E2E Branch tests"

    requirements {
        exists("docker.server.version")
    }

    dependencies {
        dependency(BuildSitePages) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
                onDependencyCancel = FailureAction.CANCEL
            }
            artifacts {
                buildRule = sameChainOrLastFinished()
                artifactRules = "+:pages.zip!** => dist/"
            }
        }
    }

    steps {
        script {
            name = "Run E2E tests"
            scriptContent = "./scripts/run-e2e-tests.sh"
        }
    }
})
