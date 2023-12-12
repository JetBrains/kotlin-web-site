package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinMetadataJvm : GitVcsRoot({
  name = "kotlin vcs root"
  url = "git@github.com:JetBrains/kotlin.git"
  branch = "1.9.21"
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
