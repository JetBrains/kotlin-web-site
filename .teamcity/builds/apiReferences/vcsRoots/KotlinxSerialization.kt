package builds.apiReferences.vcsRoots

import BuildParams.KOTLINX_SERIALIZATION_RELEASE_TAG
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxSerialization: GitVcsRoot({
  name = "kotlinx.serialization vcs root"
  url = "git@github.com:Kotlin/kotlinx.serialization.git"
  branch = "refs/heads/$KOTLINX_SERIALIZATION_RELEASE_TAG"
  branchSpec = """
        +:refs/heads/(*)
    """.trimIndent()
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
