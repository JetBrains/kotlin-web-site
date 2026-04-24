package kotlinlang_featured

import jetbrains.buildServer.configs.kotlin.Project
import kotlinlang_featured.vcsRoots.kotlinlang.GrammarGeneratorRoot
import kotlinlang_featured.vcsRoots.kotlinlang.KotlinSpecRoot
import kotlinlang_featured.vcsRoots.kotlinlang.WebHelpRoot

object SiteProject: Project({
    name = "Kotlinlang Featured"

    vcsRoot(GrammarGeneratorRoot)
    vcsRoot(WebHelpRoot)
    vcsRoot(KotlinSpecRoot)
})
