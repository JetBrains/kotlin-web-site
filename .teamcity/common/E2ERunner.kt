package common

import jetbrains.buildServer.configs.kotlin.BuildType

open class E2ERunner(init: BuildType.() -> Unit) : BuildType({
    artifactRules = """
        +:playwright-report/** => playwright-report.zip
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
