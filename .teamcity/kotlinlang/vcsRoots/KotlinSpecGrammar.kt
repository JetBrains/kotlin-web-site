package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinSpecGrammar: GitVcsRoot({
  name = "Kotlin Spec Grammar VCS root"
  url = "git@github.com:Kotlin/kotlin-spec.git"
  branch = "refs/tags/grammar/latest"
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})
