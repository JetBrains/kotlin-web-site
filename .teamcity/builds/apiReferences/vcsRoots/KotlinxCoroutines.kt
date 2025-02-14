package builds.apiReferences.vcsRoots

import BuildParams.KOTLINX_COROUTINES_RELEASE_TAG
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxCoroutines : GitVcsRoot({
  name = "kotlinx.coroutines vcs root"
  url = "git@github.com:Kotlin/kotlinx.coroutines.git"
  branch = "refs/heads/$KOTLINX_COROUTINES_RELEASE_TAG"
  branchSpec = """
        +:refs/heads/(*)
    """.trimIndent()
  useTagsAsBranches = true
  checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
