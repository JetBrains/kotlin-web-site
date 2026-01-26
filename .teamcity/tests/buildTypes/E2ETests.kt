package tests.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.builds.BuildSitePages


object E2ETests : BuildType({
    name = "E2E tests"

    artifactRules = """
        +:test-results/* => test-results.zip
    """.trimIndent()

    vcs {
        root(vcsRoots.KotlinLangOrg)
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
            name = "Set execute permissions"
            scriptContent = "chmod +x ./scripts/test/run-e2e-tests.sh"
        }
        script {
            name = "Run E2E tests"
            scriptContent = "./scripts/test/run-e2e-tests.sh"
        }
    }

    artifactRules = """
        +:test-results/ => test-results/
    """.trimIndent()

    requirements {
        exists("docker.server.version")
        contains("docker.server.osType", "linux")
    }
})
