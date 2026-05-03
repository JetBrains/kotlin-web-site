package kotlinlang_featured.projects

import jetbrains.buildServer.configs.kotlin.Project
import kotlinlang_featured.vcsRoots.kotlinlang.GrammarGeneratorRoot
import kotlinlang_featured.vcsRoots.kotlinlang.KotlinSpecRoot

object SiteProject: Project({
    name = "Kotlinlang Featured"

    vcsRoot(GrammarGeneratorRoot)
    vcsRoot(KotlinSpecRoot)
})
