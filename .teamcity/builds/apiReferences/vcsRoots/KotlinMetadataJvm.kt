package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinMetadataJvm : GitVcsRoot({
  name = "kotlin metadata vcs root"
  url = "git@github.com:JetBrains/kotlin.git"
  branch = "refs/heads/v1.9.21"
  branchSpec = """
    +:refs/heads/(*)
  """.trimIndent()
  useTagsAsBranches = true
  checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
