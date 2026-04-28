package devops.vcsRoots

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildFeatures.dockerRegistryConnections
import jetbrains.buildServer.configs.kotlin.buildSteps.dockerCommand

private const val mcpDockerFQDN = "registry.jetbrains.team/p/kotlin-website-team/containers/kotlinlang-mcp:latest"

object BuildMcpDockerImage: BuildType({
    name = "Build MCP Docker Image"
    description = "Build and publish kotlinglang MCP docker image to the jetbrains registry"

    vcs {
        root(mcpRoot, "+:. => kotlinlang-mcp")
        cleanCheckout = true
    }

    steps {
        dockerCommand {
            name = "Build MCP Docker Image"
            commandType = build {
                source = file {
                    path = "kotlinlang-mcp/Dockerfile"
                }
                namesAndTags = """
                    $mcpDockerFQDN
                """.trimIndent()
            }
        }
        dockerCommand {
            name = "Publish MCP Docker Image"
            commandType = push {
                namesAndTags = """
                    $mcpDockerFQDN
                """.trimIndent()
            }
        }
    }

    features {
        dockerRegistryConnections {
            loginToRegistry = on {
                dockerRegistryId = "jetbrains-docker-registry"
            }
            cleanupPushedImages = true
        }
    }

    requirements {
        contains("teamcity.agent.jvm.os.name", "Linux")
    }
})
