package tests.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.builds.BuildJsAssets
import kotlinlang.builds.BuildReferenceDocs
import references.builds.kotlinx.coroutines.KotlinxCoroutinesBuildApiReference
import references.builds.kotlinx.serialization.KotlinxSerializationBuildApiReference


object E2ETests : BuildType({
    name = "E2E tests"

    vcs {
        root(vcsRoots.KotlinLangOrg)
    }

    dependencies {
        artifacts(BuildReferenceDocs) {
            cleanDestination = true
            artifactRules = "+:docs.zip!** => dist/docs/"
        }

        dependency(BuildJsAssets) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "+:assets.zip!** => _assets/"
            }
        }

        dependency(KotlinxCoroutinesBuildApiReference) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "+:pages.zip!** => libs/kotlinx.coroutines/"
            }
        }

        dependency(KotlinxSerializationBuildApiReference) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "+:pages.zip!** => libs/kotlinx.serialization/"
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