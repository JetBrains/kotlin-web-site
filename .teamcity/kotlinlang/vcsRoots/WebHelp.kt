package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object WebHelp : GitVcsRoot({
  name = "webhelp"
  url = "ssh://git@git.jetbrains.team/writerside/writerside-monorepo.git"
  branch = "refs/heads/chernenko/ked-websites-stable"
  branchSpec = """
        refs/heads/(*)
        refs/tags/(*)
    """.trimIndent()
  useTagsAsBranches = true
  userNameStyle = UserNameStyle.FULL
  checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})