package devops

import devops.vcsRoots.BuildMcpDockerImage
import devops.vcsRoots.mcpRoot
import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.projectFeatures.dockerRegistry

object DevOpsProject: Project({
    name = "DevOps Tooling"
    description = "DevOps Project for building docker images, testing features and changes."

    vcsRoot(mcpRoot)

    buildType(BuildMcpDockerImage)

    // TODO: Add Application Connection Later
    features {
        dockerRegistry {
            id = "jetbrains-docker-registry"
            name = "jetbrains-docker-registry"
            url = "https://registry.jetbrains.team"
            userName = "andrei.ezerskii@jetbrains.com"
            password = "credentialsJSON:a75dc617-b711-4c41-a0a7-fb0d552e6097"
        }
    }
})
