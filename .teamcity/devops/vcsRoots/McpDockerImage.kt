package devops.vcsRoots

import jetbrains.buildServer.configs.kotlin.BuildType

object BuildMcpDockerImage: BuildType({
    name = "Build MCP Docker Image"
    description = "Build and publish kotlinglang MCP docker image to the jetbrains registry"

    vcs {
        root(mcpRoot)
        cleanCheckout = true
    }
})
