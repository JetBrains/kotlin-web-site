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

    // @ToDo: Is it safe? Should be replaced by token from storage???
    features {
        sshAgent {
            enabled = true
            teamcitySshKey = "ktl-read-write"
        }
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

        script {
            name = "Commit and Push changes"

            conditions {
                equals("teamcity.build.branch.is_default", "true")
            }

            // language=bash
            scriptContent = """
                #!/bin/bash
                set -e -u
                
                VCS_STATUS=`git status --porcelain`
                
                if [[ -n "${'$'}VCS_STATUS" ]]; then
                  echo "============="
                  echo "${'$'}VCS_STATUS"
                  git add $DATA_PATH
                  git \
                    -c user.name="Teamcity Agent" -c user.email="support@jetbrains.com" \
                    commit -m "chore(ci): [${'$'}UPDATE_TIME] update latest news"
                  echo "============="
                  git push origin HEAD:%teamcity.build.branch%
                fi
            """.trimIndent()
        }
    }
})
