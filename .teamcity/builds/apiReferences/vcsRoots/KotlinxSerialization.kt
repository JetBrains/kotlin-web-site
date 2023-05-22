package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxSerialization: GitVcsRoot({
  name = "kotlinx.serialization vcs root"
  url = "git@github.com:Kotlin/kotlinx.serialization.git"
  branch = "refs/heads/master"
  branchSpec = """
        +:refs/heads/(*)
    """.trimIndent()
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
