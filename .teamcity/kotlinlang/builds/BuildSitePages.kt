package kotlinlang.builds

import BuildParams.API_URLS
import documentation.builds.KotlinWithCoroutines
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import templates.DockerImageBuilder
import templates.scriptDistAnalyze

private const val kotlinWebsiteSetup = "/kotlin-website-setup.sh"

object BuildSitePages : BuildType({
    name = "Build site pages"

    templates(DockerImageBuilder)

    artifactRules = """
        dist/** => pages.zip
        robots.txt => pages.zip
    """.trimIndent()

    vcs {
        root(vcsRoots.KotlinLangOrg)
        cleanCheckout = true
    }

    triggers {
        finishBuildTrigger {
            buildType = FetchBlogNews.id?.value ?: error("Invalid FetchBlogNews ID")
            branchFilter = "+:<default>"
            successfulOnly = true
        }
    }

    steps {
        script {
            name = "Build html pages"
            // language=bash
            scriptContent = """
                #!/bin/bash
                
                set -x
                
                cat $kotlinWebsiteSetup
                source $kotlinWebsiteSetup
                
                ## refresh packages
                npm i -g yarn
                yarn install --frozen-lockfile
                pip install -r requirements.txt
                
                ## build
                python kotlin-website.py build
            """.trimIndent()

            dockerImage = "%dep.Kotlin_KotlinSites_Builds_KotlinlangOrg_BuildPythonContainer.kotlin-website-image%"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true

            formatStderrAsError = true
        }
        script {
            name = "Override with external source"
            dockerImage = "alpine"
            //language=bash
            scriptContent = """
                cp -fR _webhelp/reference/* build/docs/
                #cp -fR _webhelp/mobile build/docs/
                
                mv build dist
                
                cp -fR spec dist/
                cp -fR _assets dist/
                
                cp -fR out/* dist/
                cp -fR out/_next dist/_next/
                
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
                  url="https://branch-%teamcity.build.branch%.kotlin-web-site.labs.jb.gg"
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

//        dependency(BuildReferenceDocs) {
//            snapshot {
//                onDependencyFailure = FailureAction.FAIL_TO_START
//            }
//            artifacts {
//                artifactRules = "+:docs.zip!** => _webhelp/reference/"
//            }
//        }
    }
})
