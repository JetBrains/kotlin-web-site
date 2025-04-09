package builds.apiReferences.vcsRoots

import BuildParams.KOTLINX_IO_RELEASE_TAG
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxIO : GitVcsRoot({
  name = "kotlinx-io vcs root"
  url = "git@github.com:Kotlin/kotlinx-io.git"
  branch = KOTLINX_IO_RELEASE_TAG
  branchSpec = """
    +:refs/heads/(*)
    +:refs/tags/(*)
  """.trimIndent()
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
