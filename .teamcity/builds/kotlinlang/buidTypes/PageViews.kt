package builds.kotlinlang.buidTypes

import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import java.io.File
import java.nio.file.Paths

private fun readScript(name: String): String {
    val file = File(Paths.get("scripts/$name.mjs").toAbsolutePath().toString())
    return file.readText()
}

private val pageViewsCollectId = AbsoluteId("WebTeam_BuildsForDeploymentJetBrainsCom_Algolia_PageViewsFromGoogle")

object PageViews : BuildType({
    name = "Fetch Page Views"
    description = "Build data files with page views statistics for kotlin websites"

    artifactRules = """
        page_views_list.json
        page_views_map.json
      """.trimIndent()

    triggers {
        finishBuildTrigger {
            buildType = pageViewsCollectId.absoluteId
            branchFilter = "+:<default>"
            successfulOnly = true
        }
    }

    steps {
        script {
            name = "Prepare page views"
            scriptContent = """
                #!/usr/bin/env bash
                ":" //# comment; exec /usr/bin/env node --input-type=module - "${'$'}@" < "${'$'}0"
                
                ${readScript("stats/pageviews")}
            """.trimIndent()
            dockerImage = "node:lts-slim"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
        }
    }

    dependencies {
        artifacts(pageViewsCollectId) {
            buildRule = lastSuccessful()
            artifactRules = """
                +:unique_pageviews_pages_000000000000.json => data
            """.trimIndent()
        }
    }
})
