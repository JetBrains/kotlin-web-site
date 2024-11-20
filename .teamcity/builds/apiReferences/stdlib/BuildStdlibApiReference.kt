package builds.apiReferences.stdlib

import BuildParams.KOTLIN_CORE_API_BUILD_ID
import builds.scriptDistAnalyze
import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

fun BuildSteps.copyDokkaFiles(lib: String, resultPath: String = "build/dokka/htmlMultiModule") = script {
    //language=bash
    scriptContent = """
        mkdir -p "dist/api"
        cp -r "$resultPath" "dist/api/$lib"
    """.trimIndent()
    dockerImage = "alpine"
}

fun BuildSteps.sitemapGenerate(lib: String) = scriptDistAnalyze {
    //language=bash
    scriptContent += "\n" + """
        cd ../../dist
        mv sitemap.xml api/$lib/sitemap.xml
    """.trimIndent()
}


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
        sitemapGenerate("core")
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
