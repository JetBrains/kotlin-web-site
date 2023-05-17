package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxCoroutines : GitVcsRoot({
  name = "kotlinx.coroutines vcs root"
  url = "git@github.com:Kotlin/kotlinx.coroutines.git"
  branch = "refs/heads/master"
  branchSpec = """
        +:refs/heads/(*)
    """.trimIndent()
  useTagsAsBranches = true
  checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
