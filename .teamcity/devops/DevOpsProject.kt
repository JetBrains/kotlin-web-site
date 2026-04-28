package devops

import devops.vcsRoots.BuildMcpDockerImage
import devops.vcsRoots.mcpRoot
import jetbrains.buildServer.configs.kotlin.Project

object DevOpsProject: Project({
    name = "DevOps Tooling"
    description = "DevOps Project for building docker images, testing features and changes."

    vcsRoot(mcpRoot)

    buildType(BuildMcpDockerImage)
})
