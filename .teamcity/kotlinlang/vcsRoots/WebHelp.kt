package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object WebHelp : GitVcsRoot({
  name = "webhelp"
  url = "ssh://git@git.jetbrains.team/kotlin-website-team/webhelp.git"
  branch = "refs/heads/hktn25/main"
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