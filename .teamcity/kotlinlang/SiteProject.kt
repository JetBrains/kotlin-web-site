package kotlinlang

import jetbrains.buildServer.configs.kotlin.Project
import kotlinlang.builds.*
import kotlinlang.vcsRoots.GrammarGenerator
import kotlinlang.vcsRoots.KotlinSpec
import kotlinlang.vcsRoots.WebHelp
import templates.DockerImageBuilder

object SiteProject : Project({
  name = "kotlinlang.org"

  buildTypesOrder = arrayListOf(
    BuildSitePages,
    FetchBlogNews,
    PdfGenerator,
    BuildSearchIndex,
    BuildReferenceDocs,
    BuildKmpDevDocs,
    BuildWebHelpFrontend,
    BuildKotlinGrammar,
    BuildKotlinSpec,
    BuildJsAssets,
    PageViews,
  )

  buildTypesOrder.forEach {
    buildType(it)
  }

  template(DockerImageBuilder)

  vcsRoot(GrammarGenerator)
  vcsRoot(KotlinSpec)
  vcsRoot(WebHelp)
})