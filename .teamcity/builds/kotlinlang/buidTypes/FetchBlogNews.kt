package builds.kotlinlang.buidTypes

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object FetchBlogNews : BuildType({
    name = "Fetch Blog News"

    vcs {
        root(vcsRoots.KotlinLangOrg)
    }

    steps {
        script {
            name = "fetch"
            scriptContent = ""
        }
    }
})
