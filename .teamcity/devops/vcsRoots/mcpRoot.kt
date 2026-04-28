package devops.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object mcpRoot: GitVcsRoot ({
    name = "KotlinLang VCS Root"
    url = "https://git.jetbrains.team/kotlin-ai/kotlinlang-mcp-server.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
