package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinSpec: GitVcsRoot({
  name = "Kotlin Spec VCS root"
  url = "ssh://git@github.com/Kotlin/kotlin-spec"
  branch = "refs/heads/release"
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})