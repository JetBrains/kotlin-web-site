package builds.apiReferences.buildTypes

import jetbrains.buildServer.configs.kotlin.BuildType

object PrepareCustomDokkaTemplates: BuildType({
  name = "Prepare Custom Dokka Templates"

  vcs {
    root(vcsRoots.KotlinLangOrg)
  }

  artifactRules = "dokka-templates/** => dokka-templates"
})
