package kotlinlang_featured.vcsRoots.kotlinlang

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

// Grammar Generator
object GrammarGeneratorRoot: GitVcsRoot({
    name = "Grammar Generator Root"
    url = "ssh://git@github.com/Kotlin/kotlin-website-grammar-generator"
    branch = "refs/heads/master"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

// Kotlin Specs
object KotlinSpecRoot: GitVcsRoot({
    name = "Kotlin Spec Root"
    url = "ssh://git@github.com/Kotlin/kotlin-spec"
    branch = "refs/heads/release"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})

// Webhelp
object WebHelpRoot : GitVcsRoot({
    name = "WebHelp Root"
    url = "ssh://git@github.com/JetBrains/webhelp"
    branch = "refs/heads/master"
    branchSpec = """
        refs/heads/(*)
        refs/tags/(*)
    """.trimIndent()
    useTagsAsBranches = true
    userNameStyle = UserNameStyle.FULL
    checkoutPolicy = AgentCheckoutPolicy.USE_MIRRORS
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
