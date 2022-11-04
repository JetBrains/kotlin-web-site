package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxDatetime: GitVcsRoot({
  name = "kotlinx-datetime vcs root"
  url = "git@github.com:Kotlin/kotlinx-datetime.git"
  branch = "refs/tags/${BuildParams.KOTLINX_DATETIME_RELEASE_TAG}"
  branchSpec = """
        +:refs/tags/(*)
    """.trimIndent()
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
