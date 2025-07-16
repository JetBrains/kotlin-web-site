package documentation.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinMultiplatformVCS: GitVcsRoot ({
    name = "Kotlin Multiplatform root"
    url = "https://github.com/JetBrains/kotlin-multiplatform-dev-docs.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.AUTO
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
