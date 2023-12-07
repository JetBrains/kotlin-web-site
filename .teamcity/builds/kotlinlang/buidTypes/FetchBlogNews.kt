package builds.kotlinlang.buidTypes

import jetbrains.buildServer.configs.kotlin.BuildType

object FetchBlogNews : BuildType({
    name = "Fetch Blog News"

    vcs {
        root(vcsRoots.KotlinLangOrg)
    }

    scripts {
        script {
            name = "fetch"
            scriptContent = ""
        }
    }
})
