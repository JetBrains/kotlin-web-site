package common

import jetbrains.buildServer.configs.kotlin.BuildStep
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

open class E2ERunner(init: BuildType.() -> Unit) : BuildType({
    artifactRules = """
        +:test-results/* => test-results.zip
    """.trimIndent()

    params {
        param("env.WEBTEAM_UI_NPM_TOKEN", "%WEBTEAM_UI_NPM_TOKEN%")
        param("env.CI", "true")
    }

    vcs {
        root(vcsRoots.KotlinLangOrg)
    }

    init()
})
