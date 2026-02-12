package kotlinlang.builds

import BuildParams.API_URLS
import documentation.builds.KotlinMultiplatform
import documentation.builds.KotlinWithCoroutines
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import templates.scriptDistAnalyze

object BuildSitePages : BuildType({
    name = "Build site pages"

    artifactRules = """
        dist/** => pages.zip
        robots.txt => pages.zip
        reports/** => reports.zip
    """.trimIndent()

    vcs {
        root(vcsRoots.KotlinLangOrg)
        cleanCheckout = true
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
        }
        finishBuildTrigger {
            buildType = FetchBlogNews.id?.value ?: error("Invalid FetchBlogNews ID")
            branchFilter = "+:<default>"
            successfulOnly = true
        }
        finishBuildTrigger {
            buildType = KotlinMultiplatform.id?.value ?: error("Invalid KotlinMultiplatform ID")
            branchFilter = "+:*"
            successfulOnly = true
        }
        finishBuildTrigger {
            buildType = KotlinWithCoroutines.id?.value ?: error("Invalid KotlinWithCoroutines ID")
            branchFilter = "+:*"
            successfulOnly = true
        }
    }

    steps {
        script {
            name = "Override with external source"
            dockerImage = "alpine"
            //language=bash
            scriptContent = """
                set -e
                
                mkdir -p dist/
                
                echo "Copy python artifacts to dist"
                #cp -fR build/* dist/
                mkdir -p dist/_assets/
                cp -fR _assets/* dist/_assets/
                
                echo "Copy spec assets to dist"
                mkdir -p dist/spec
                cp -fR spec/* dist/spec/
                
                echo "Copy documentation to dist"
                mkdir -p dist/docs/multiplatform
                cp -fR _webhelp/reference/* dist/docs/
                cp -fR _webhelp/multiplatform/* dist/docs/multiplatform/
                
                echo "Copy nextjs artifacts to dist"
                cp -fR out/* dist/
                
                echo "Copy backward stdlib artifacts to dist"
                mkdir -p "dist/api/latest/jvm/stdlib"
                cp package-list-stdlib dist/api/latest/jvm/stdlib/package-list
                
                mkdir -p "dist/api/latest/kotlin.test"
                cp package-list-kotlin-test dist/api/latest/kotlin.test/package-list
            """.trimIndent()
        }
        step(scriptDistAnalyze {})
        script {
            name = "Collect sitemap_index.xml"
            // language=sh
            scriptContent = """
                set -x
                echo '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' > dist/sitemap_index.xml
                echo '<sitemap><loc>https://kotlinlang.org/sitemap.xml</loc></sitemap>' >> dist/sitemap_index.xml
                ${API_URLS.joinToString("\n") { id -> "echo '<sitemap><loc>https://kotlinlang.org/$id/sitemap.xml</loc></sitemap>' >> dist/sitemap_index.xml" }}
                echo '</sitemapindex>' >> dist/sitemap_index.xml
            """.trimIndent()
            dockerImage = "alpine"
        }
        script {
            name = "Update build status"
            // language=bash
            scriptContent = """
                #!/bin/bash
                
                if [[ "%teamcity.build.branch%" == "<default>" ]]; then
                  url="https://branch-.kotlin-web-site.labs.jb.gg"
                else
                  branch="%teamcity.build.branch%"
                  safe_branch="${'$'}{branch//\//--}"
                  url="https://branch-${'$'}safe_branch.kotlin-web-site.labs.jb.gg"
                fi
                
                echo " ##teamcity[buildStatus text='{build.status.text} ${'$'}{url}'] "
            """.trimIndent()
        }
    }

    dependencies {
        dependency(BuildJsAssets) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
                onDependencyCancel = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "+:assets.zip!** => ./"
            }
        }

        dependency(BuildKotlinSpec) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
                onDependencyCancel = FailureAction.CANCEL
                synchronizeRevisions = false
            }
            artifacts {
                buildRule = lastSuccessful()
                cleanDestination = true
                artifactRules = """
                    +: spec.zip!html => spec
                    +: spec.zip!pdf => spec/pdf
                """.trimIndent()
            }
        }

        dependency(KotlinWithCoroutines) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
                onDependencyCancel = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = """
                    +:webHelpImages.zip!** => _webhelp/reference/images/
                    +:webHelpKR2.zip!** => _webhelp/reference/
                """.trimIndent()
            }
        }

        dependency(KotlinMultiplatform) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
                onDependencyCancel = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = """
                    +:webHelpImages.zip!** => _webhelp/multiplatform/images/
                    +:webHelpMPD2.zip!** => _webhelp/multiplatform/
                """.trimIndent()
            }
        }
    }
})
