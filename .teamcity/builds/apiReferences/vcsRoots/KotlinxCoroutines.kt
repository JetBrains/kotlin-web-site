package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxCoroutines : GitVcsRoot({
  name = "kotlinx.coroutines vcs root"
  url = "git@github.com:Kotlin/kotlinx.coroutines.git"
  branch = "refs/tags/${BuildParams.KOTLINX_COROUTINES_RELEASE_TAG}"
  branchSpec = """
        +:refs/tags/(*)
    """.trimIndent()
  useTagsAsBranches = true
  checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
