package builds.kotlinlang.buidTypes

import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.CheckoutMode
import jetbrains.buildServer.configs.kotlin.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.schedule

private fun BuildSteps.nodejs(block: ScriptBuildStep.() -> Unit) = step(
    ScriptBuildStep {
        dockerImage = "node:20"
        dockerPull = true
    }.apply(block),
)

private const val DATA_PATH = "latest-news"
private const val SCRIPT_PATH = "scripts/latest-news"

object FetchBlogNews : BuildType({
    name = "Fetch Blog News"

    artifactRules = """
        $DATA_PATH => latest-news.zip
    """.trimIndent()

    triggers {
        schedule {
            schedulingPolicy = cron {
                hours = "*/1"
            }
            branchFilter = "+:<default>"
            triggerBuild = always()
        }
    }

    requirements {
        contains("docker.server.osType", "linux")
    }

    vcs {
        root(vcsRoots.KotlinLangOrg, """
            +:$DATA_PATH
            +:$SCRIPT_PATH
        """.trimIndent())

        cleanCheckout = true
        showDependenciesChanges = true
        checkoutMode = CheckoutMode.ON_AGENT
    }

    steps {
        nodejs {
            name = "Install packages"
            workingDir = "$SCRIPT_PATH"
            // language=bash
            scriptContent = """ 
                #!/bin/bash
                set -e -u
                NODE_ENV=production npm ci
            """.trimIndent()
        }

        nodejs {
            name = "Fetch news"
            // language=bash
            scriptContent = """
                #!/bin/bash
                set -e -u
                UPDATE_TIME=`date -u +"%%Y-%%m-%%d %%H:%%M.%%S"`
                echo "##teamcity[setParameter name='env.UPDATE_TIME' value='${'$'}UPDATE_TIME']"
                node ./$SCRIPT_PATH/index.js
            """.trimIndent()
        }
    }
})
