package kotlinlang

import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.projectFeatures.dockerRegistry
import kotlinlang.builds.*
import kotlinlang.vcsRoots.GrammarGenerator
import kotlinlang.vcsRoots.KotlinSpecGrammar
import kotlinlang.vcsRoots.KotlinlangMcpRoot
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
        KotlinLangMCP,
    )

    buildTypesOrder.forEach {
        buildType(it)
    }

    template(DockerImageBuilder)

    vcsRoot(GrammarGenerator)
    vcsRoot(KotlinSpecGrammar)
    vcsRoot(WebHelp)
    vcsRoot(KotlinlangMcpRoot)

    features {
        dockerRegistry {
            id = "kotlinWebsitesRegistry"
            name = "Kotlin Websites Registry"
            url = "https://registry.jetbrains.team"
            userName = "6a096c4a-9679-41e7-9e42-f3f6cf375ea1"
            password = "credentialsJSON:7803fda3-d73d-4f49-9186-416f890fc3da"
        }
    }
})
