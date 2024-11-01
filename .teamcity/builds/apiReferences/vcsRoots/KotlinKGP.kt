package builds.apiReferences.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinKGP : GitVcsRoot({
  name = "kotlin Gradle Plugin vcs root"
  url = "git@github.com:JetBrains/kotlin.git"
  branch = "rr/yahor/fix-api-reference-publication"
  branchSpec = """
    +:refs/heads/(*)
    +:refs/tags/(*)
  """.trimIndent()
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
