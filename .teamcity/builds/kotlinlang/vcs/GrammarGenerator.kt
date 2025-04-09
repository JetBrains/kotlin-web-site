package builds.kotlinlang.vcs

import builds.common.VCS
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object GrammarGenerator: GitVcsRoot({
  name = "Grammar Generator VCS root"
  url = "ssh://git@github.com/Kotlin/kotlin-website-grammar-generator"
  branch = VCS.branch("master")
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})