package references.vcsRoots

import BuildParams.KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_TAG
import common.extensions.VCS
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinxCollectionsImmutable : GitVcsRoot({
  name = "kotlinx.collections.immutable vcs root"
  url = "git@github.com:Kotlin/kotlinx.collections.immutable.git"
  branch = VCS.tag(KOTLINX_COLLECTIONS_IMMUTABLE_RELEASE_TAG)
  branchSpec = "+:refs/tags/*"
  useTagsAsBranches = true
  authMethod = uploadedKey {
    uploadedKey = "teamcity"
  }
})
