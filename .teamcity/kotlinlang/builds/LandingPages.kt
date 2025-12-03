package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.vcsRoots.LandingPagesVcs

object LandingPagesProject: Project({
    name = "Landing Pages"
    description = "Build and deploy landing pages as https://kotlinlang.org/lp/page/"

    vcsRoot(LandingPagesVcs)
    buildType(LandingPagesBuild)
})

object LandingPagesBuild: BuildType ({
    name = "Build Landing"

    artifactRules = "landings/%LANDING_NAME%/public => build.zip"

    params {
        select("LANDING_NAME", "", label = "Landing Name", display = ParameterDisplay.PROMPT,
            options = listOf("test", "multiplatform", "server-side", "event-14", "kotlin-heroes", "10yearsofkotlin", "mobile"))
    }

    vcs {
        root(LandingPagesVcs)
    }

    steps {
        script {
            name = "Build landing"
            workingDir = "landings/%LANDING_NAME%/"
            scriptContent = """
                #!/bin/bash
                set -e
                
                echo "##teamcity[buildStatus text='%LANDING_NAME%']"
                
                yarn install --frozen-lockfile
                yarn build
            """.trimIndent()
            dockerImage = "node:14"
        }
    }

    requirements {
        equals("docker.server.osType", "linux")
    }
})
