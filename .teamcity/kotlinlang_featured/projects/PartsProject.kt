package kotlinlang_featured.projects

import jetbrains.buildServer.configs.kotlin.Project
import kotlinlang_featured.builds.parts.BuildWebHelpFrontend
import kotlinlang_featured.vcsRoots.kotlinlang.WebHelpRoot

object PartsProject: Project({
    name = "Parts"
    description = "Kotlinlang Related Parts"

    buildType(BuildWebHelpFrontend)

    vcsRoot(WebHelpRoot)
})
