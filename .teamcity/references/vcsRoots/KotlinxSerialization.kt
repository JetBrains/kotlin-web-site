package references.vcsRoots

import BuildParams.KOTLINX_SERIALIZATION_RELEASE_TAG
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxSerialization: GitVcsRoot({
  name = "kotlinx.serialization vcs root"
  url = "git@github.com:Kotlin/kotlinx.serialization.git"
  branch = KOTLINX_SERIALIZATION_RELEASE_TAG
  branchSpec = """
    +:refs/heads/(*)
    +:refs/tags/(*)
  """.trimIndent()
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
