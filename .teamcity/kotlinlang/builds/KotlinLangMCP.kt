package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildStep
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.DockerCommandStep
import jetbrains.buildServer.configs.kotlin.buildSteps.dockerCommand
import kotlinlang.vcsRoots.KotlinlangMcpRoot

object KotlinLangMCP: BuildType ({
    name = "KotlinLang MCP"
    description = "Build and publish kotlinlang mcp server"

    vcs {
        root(KotlinlangMcpRoot)
    }

    steps {
        dockerCommand {
            name = "Build MCP Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                platform = DockerCommandStep.ImagePlatform.Linux
                namesAndTags = """
                    registry.jetbrains.team/p/kotlin-website-team/containers/kotlinlang-mcp:latest
                """.trimIndent()
            }
        }
        dockerCommand {
            name = "Push MCP Docker Image"
            executionMode = BuildStep.ExecutionMode.RUN_ON_SUCCESS
            commandType = push {
                namesAndTags = "registry.jetbrains.team/p/kotlin-website-team/containers/kotlinlang-mcp:latest"
            }
        }
//        script {
//            name = "Apply changes to k8s"
//            executionMode = BuildStep.ExecutionMode.RUN_ON_SUCCESS
//            scriptContent = """
//                #!/bin/bash
//                kubectl apply -f k8s/kotlinlang-mcp.yaml
//            """.trimIndent()
//        }
    }
})
