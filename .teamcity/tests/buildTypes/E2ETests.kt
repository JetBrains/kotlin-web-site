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

    requirements {
        exists("docker.server.version")
        contains("docker.server.osType", "linux")
    }

    vcs {
        root(vcsRoots.KotlinLangOrg)
    }

    params {
        param("env.WEBTEAM_UI_NPM_TOKEN", "%WEBTEAM_UI_NPM_TOKEN%")
    }

    steps {
        script {
            name = "Run E2E tests"
            scriptContent = "./scripts/test/run-e2e-tests.sh"
        }
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
})
