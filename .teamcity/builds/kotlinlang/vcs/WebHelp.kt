package builds.kotlinlang.vcs
import builds.common.VCS
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object WebHelp : GitVcsRoot({
  name = "webhelp"
  url = "ssh://git@github.com/JetBrains/webhelp"
  branch = VCS.branch("master")
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