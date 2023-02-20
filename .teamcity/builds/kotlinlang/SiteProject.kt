package builds.kotlinlang

import builds.kotlinlang.buidTypes.BuildSitePages
import builds.kotlinlang.templates.DockerImageBuilder
import jetbrains.buildServer.configs.kotlin.Project

object SiteProject : Project({
  name = "Build kotlinlang.org"

  buildType(BuildSitePages)

  template(DockerImageBuilder)
})