package documentation.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot


// KmpRoots
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

// Kotlin Reference With Coroutine Roots
object KotlinReferenceRoot: GitVcsRoot ({
    name = "Kotlin Reference"
    url = "https://github.com/JetBrains/kotlin-web-site.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.AUTO
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object KotlinxCoroutinesRoot: GitVcsRoot ({
    name = "Kotlinx Coroutines"
    url = "https://github.com/Kotlin/kotlinx.coroutines.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.AUTO
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object KotlinxLincheckRoot: GitVcsRoot ({
    name = "Kotlinx Lincheck"
    url = "https://github.com/JetBrains/lincheck.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.AUTO
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object DokkaRoot: GitVcsRoot ({
    name = "Dokka"
    url = "https://github.com/Kotlin/dokka.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.AUTO
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object APIGuidelinesRoot: GitVcsRoot ({
    name = "API Guidelines"
    url = "https://github.com/Kotlin/api-guidelines.git"
    branch = "refs/heads/main"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.AUTO
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
