package builds

import BuildParams.SEARCH_APP_ID
import builds.kotlinlang.buidTypes.PageViews
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import vcsRoots.KotlinLangOrg

const val SCRIPT_PATH = "scripts/dist";

fun scriptDistAnalyze(block: ScriptBuildStep.() -> Unit) = ScriptBuildStep {
    id = "script-dist-analyze"
    name = "Run dist/ analyzer"
    //language=bash
    scriptContent = """
        #!/bin/sh
        set -e
        npm install
        npm run generate-metadata
    """.trimIndent()
    dockerImage = "node:22-alpine"
    workingDir = SCRIPT_PATH
    dockerPull = true
}.apply(block)

abstract class TemplateSearchIndex(init: BuildType.() -> Unit) : BuildType({
    artifactRules = """
        reports/** => reports.zip
    """.trimIndent()

    requirements {
        doesNotContain("docker.server.osType", "windows")
    }

    params {
        param("env.NODE_OPTIONS", "--max-old-space-size=32768")

        param("env.WH_SEARCH_USER", SEARCH_APP_ID)
        param("env.WH_SEARCH_WRITE_KEY", "%ALGOLIA_WRITE_API_KEY%")
        param("env.WH_SKIP_PREFILTER", "true") // analyze all files
    }

    vcs {
        root(KotlinLangOrg, "$SCRIPT_PATH/")
        cleanCheckout = true
        showDependenciesChanges = true
    }

    triggers {
        schedule {
            schedulingPolicy = cron {
                hours = "4"
                dayOfMonth = "*/2"
            }
            branchFilter = "+:<default>"
        }
    }

    steps {
        step(scriptDistAnalyze {})
    }

    dependencies {
        dependency(PageViews) {
            snapshot {}
            artifacts {
                artifactRules = """
                    page_views_map.json => data/
                """.trimIndent()
            }
        }
    }

    init(this)
})
