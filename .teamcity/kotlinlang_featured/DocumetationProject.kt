package kotlinlang_featured

import jetbrains.buildServer.configs.kotlin.Project
import kotlinlang_featured.vcsRoots.documentation.KotlinMultiplatformRoot
import kotlinlang_featured.vcsRoots.documentation.KotlinReferenceRoot
import kotlinlang_featured.vcsRoots.documentation.KotlinxCoroutinesRoot
import kotlinlang_featured.vcsRoots.documentation.DokkaRoot
import kotlinlang_featured.vcsRoots.documentation.APIGuidelinesRoot
import kotlinlang_featured.vcsRoots.documentation.KotlinxLincheckRoot

object DocumentationProject: Project ({
    name = "Documentation Featured"

    vcsRoot(KotlinMultiplatformRoot)
    vcsRoot(KotlinReferenceRoot)
    vcsRoot(KotlinxCoroutinesRoot)
    vcsRoot(KotlinxLincheckRoot)
    vcsRoot(DokkaRoot)
    vcsRoot(APIGuidelinesRoot)
})
