package builds.apiReferences.stdlib

import BuildParams.KOTLIN_CORE_API_BUILD_ID
import builds.SCRIPT_PATH
import builds.scriptDistAnalyze
import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildStdlibApiReference : BuildType({
    name = "Core API pages"
    description = "Build pages for Kotlin Core API"

    vcs {
        root(
            vcsRoots.KotlinLangOrg, """
                scripts/doindex/
            """.trimIndent()
        )
    }

    artifactRules = """
        +:dist/api/core/** => pages.zip
        +:pages.json => ./
    """.trimIndent()

    steps {
        script {
            name = "Drop unnecessary files"
            // language=bash
            scriptContent = """
                rm ./dist/api/core/not-found-version.html
                
                # empty pages.json
                mv ./dist/api/core/scripts/pages.json ./
                echo "[]" > ./dist/api/core/scripts/pages.json
            """.trimIndent()
        }
        script {
            name = "Add no robots for older versions"
            workingDir = "dist/"
            //language=bash
            scriptContent = """
                #!/bin/sh
                find . -type f -path "*/api/*/older/*.html" -exec sed -i -E 's/(<head[^>]*>)/\1<meta name="robots" content="noindex, nofollow">/g' {} \;
            """.trimIndent()
            dockerImage = "alpine"
        }
        scriptDistAnalyze {
            scriptContent += """
                cd ../..
                mv sitemap.xml api/core/sitemap.xml
            """.trimIndent()
        }
    }

    dependencies {
        dependency(AbsoluteId(KOTLIN_CORE_API_BUILD_ID)) {
            artifacts {
                buildRule = lastSuccessful()
                cleanDestination = true
                artifactRules = "latest-version.zip!all-libs/** => dist/api/core/"
            }
        }
    }
})
