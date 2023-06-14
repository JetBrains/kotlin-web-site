package builds.apiReferences.stdlib

import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildType

/**
 * It is used outside the configuration by stdlib builder.
 */
object StdlibPrepareDokkaTemplates: BuildType({
  name = "Prepare dokka templates for stdlib"

  templates(PrepareDokkaTemplate)
})