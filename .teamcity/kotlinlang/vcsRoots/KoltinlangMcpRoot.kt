package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object KotlinlangMcpRoot: GitVcsRoot ({
    name = "KotlinLang MCP Server root"
    url = "ssh://git@git.jetbrains.team/kotlin-ai/kotlinlang-mcp-server.git"
    branch = "refs/heads/master"
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
