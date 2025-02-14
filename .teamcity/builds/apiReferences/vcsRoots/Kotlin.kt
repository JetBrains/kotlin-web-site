package builds.apiReferences.vcsRoots

import BuildParams.KOTLIN_RELEASE_TAG
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object Kotlin : GitVcsRoot({
  name = "kotlin metadata vcs root"
  url = "git@github.com:JetBrains/kotlin.git"
  branch = KOTLIN_RELEASE_TAG
  branchSpec = """
    +:refs/heads/(*)
    +:refs/tags/(*)
  """.trimIndent()
  useTagsAsBranches = true
  checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
