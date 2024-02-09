package vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinLangOrg: GitVcsRoot({
  name = "kotlinlang.org VCS root"
  url = "ssh://git@github.com/JetBrains/kotlin-web-site"
  branch = "refs/heads/master"
  branchSpec = "+:refs/heads/(*)"
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})
