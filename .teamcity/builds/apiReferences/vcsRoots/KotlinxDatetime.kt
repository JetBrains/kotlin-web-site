package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxDatetime: GitVcsRoot({
  name = "kotlinx-datetime vcs root"
  url = "git@github.com:Kotlin/kotlinx-datetime.git"
  branch = "refs/heads/latest-release"
  branchSpec = """
        +:refs/heads/(*)
        +:refs/tags/(*)
    """.trimIndent()
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
