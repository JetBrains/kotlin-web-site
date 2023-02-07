package builds.apiReferences.stdlib

import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

object StdlibPrepareDokkaTemplates: BuildType({
  name = "Prepare dokka templates for stdlib"

  templates(PrepareDokkaTemplate)
})