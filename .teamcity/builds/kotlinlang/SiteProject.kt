package builds.kotlinlang

import builds.kotlinlang.buidTypes.*
import builds.kotlinlang.templates.DockerImageBuilder
import builds.kotlinlang.vcs.GrammarGenerator
import builds.kotlinlang.vcs.KotlinSpec
import builds.kotlinlang.vcs.WebHelp
import jetbrains.buildServer.configs.kotlin.Project

object SiteProject : Project({
  name = "kotlinlang.org"

  buildType(BuildJsAssets)
  buildType(BuildKotlinSpec)
  buildType(BuildKotlinGrammar)
  buildType(BuildWebHelpFrontend)
  buildType(BuildReferenceDocs)
  buildType(BuildSitePages)
  buildType(FetchBlogNews)
  buildType(PdfGenerator)
  buildType(BuildSearchIndex)

  buildTypesOrder = arrayListOf(
    BuildSitePages,
    FetchBlogNews,
    PdfGenerator,
    BuildSearchIndex,
    BuildReferenceDocs,
    BuildWebHelpFrontend,
    BuildKotlinGrammar,
    BuildKotlinSpec,
    BuildJsAssets
  )

  template(DockerImageBuilder)

  vcsRoot(GrammarGenerator)
  vcsRoot(KotlinSpec)
  vcsRoot(WebHelp)
})