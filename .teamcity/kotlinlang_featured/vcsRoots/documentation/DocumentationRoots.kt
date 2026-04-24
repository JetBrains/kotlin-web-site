package kotlinlang_featured.vcsRoots.documentation

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

// Kotlin Multiplatform Root
object KotlinMultiplatformRoot: GitVcsRoot({
    name = "Kotlin Multiplatform Root"
    url = "git@github.com:JetBrains/kotlin-multiplatform-dev-docs.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

// Kotlin Reference Root
object KotlinReferenceRoot: GitVcsRoot ({
    name = "Kotlin Reference Root"
    url = "git@github.com:JetBrains/kotlin-web-site.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object KotlinxCoroutinesRoot: GitVcsRoot ({
    name = "Kotlinx Coroutines Root"
    url = "git@github.com:Kotlin/kotlinx.coroutines.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object KotlinxLincheckRoot: GitVcsRoot ({
    name = "Kotlinx Lincheck Root"
    url = "git@github.com:JetBrains/lincheck.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object DokkaRoot: GitVcsRoot ({
    name = "Dokka Root"
    url = "git@github.com:Kotlin/dokka.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

object APIGuidelinesRoot: GitVcsRoot ({
    name = "API Guidelines Root"
    url = "git@github.com:Kotlin/api-guidelines.git"
    branch = "refs/heads/main"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
