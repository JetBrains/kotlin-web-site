package builds.apiReferences.stdlib

import BuildParams.KOTLIN_CORE_API_BUILD_ID
import builds.SCRIPT_PATH
import builds.apiReferences.scriptGenerateSitemap
import builds.apiReferences.scriptNoRobots
import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import vcsRoots.KotlinLangOrg

private const val PAGES_ROOT = "dist/api/core"

object BuildStdlibApiReference : BuildType({
    name = "Core API pages"
    description = "Build pages for Kotlin Core API"

    vcs {
        root(KotlinLangOrg, "$SCRIPT_PATH/")
    }

    artifactRules = """
        +:$PAGES_ROOT/** => pages.zip
        +:pages.json => ./
    """.trimIndent()

    steps {
        script {
            name = "Drop unnecessary files"
            // language=bash
            scriptContent = """
                rm ./$PAGES_ROOT/not-found-version.html
                
                # empty pages.json
                mv ./$PAGES_ROOT/scripts/pages.json ./
                echo "[]" > ./$PAGES_ROOT/scripts/pages.json
            """.trimIndent()
        }
        step(scriptNoRobots(PAGES_ROOT))
        step(scriptGenerateSitemap(PAGES_ROOT))
    }

    dependencies {
        dependency(AbsoluteId(KOTLIN_CORE_API_BUILD_ID)) {
            artifacts {
                buildRule = tag("publish", "*")
                cleanDestination = true
                artifactRules = "latest-version.zip!all-libs/** => $PAGES_ROOT/"
            }
        }
    }
})
