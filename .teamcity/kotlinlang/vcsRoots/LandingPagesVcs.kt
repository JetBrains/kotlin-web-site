package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object LandingPagesVcs: GitVcsRoot ( {
    name = "lp-kotlinlang.org"
    url = "git@github.com:JetBrains/lp-kotlinlang.org.git"
    pushUrl = "git@github.com:JetBrains/lp-kotlinlang.org.git"
    branch = "refs/heads/master"
    branchSpec = """
        refs/heads/(*)
    """.trimIndent()
    userNameStyle = UserNameStyle.USERID
    checkoutSubmodules = CheckoutSubmodules.SUBMODULES_CHECKOUT
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
