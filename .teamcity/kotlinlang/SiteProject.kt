package kotlinlang

import jetbrains.buildServer.configs.kotlin.Project
import kotlinlang.builds.*
import kotlinlang.vcsRoots.CmsPoc
import kotlinlang.vcsRoots.GrammarGenerator
import kotlinlang.vcsRoots.KotlinSpecGrammar
import kotlinlang.vcsRoots.WebHelp
import templates.DockerImageBuilder

object SiteProject : Project({
    name = "kotlinlang.org"

    buildTypesOrder = arrayListOf(
        BuildSitePages,
        FetchBlogNews,
        PdfGenerator,
        BuildSearchIndex,
        BuildWebHelpFrontend,
        BuildKotlinGrammar,
        BuildKotlinSpec,
        BuildJsAssets,
        PageViews,
        CmsPocSync,
    )

    buildTypesOrder.forEach {
        buildType(it)
    }

    template(DockerImageBuilder)

    vcsRoot(GrammarGenerator)
    vcsRoot(KotlinSpecGrammar)
    vcsRoot(CmsPoc)
    vcsRoot(WebHelp)
})
