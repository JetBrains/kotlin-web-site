package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object CmsPoc : GitVcsRoot({
  name = "cms-poc"
  url = "ssh://git@git.jetbrains.team/kotlin-website-team/cms-poc.git"
  branch = "refs/heads/main"
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})