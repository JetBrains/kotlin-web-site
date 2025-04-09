package builds.kotlinlang.vcs

import builds.common.VCS
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinSpec: GitVcsRoot({
  name = "Kotlin Spec VCS root"
  url = "ssh://git@github.com/Kotlin/kotlin-spec"
  branch = VCS.branch("release")
  authMethod = uploadedKey {
    uploadedKey = "default teamcity key"
  }
})