package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildFeatures.dockerRegistryConnections
import jetbrains.buildServer.configs.kotlin.buildSteps.DockerCommandStep
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildPythonContainer: BuildType({
    name = "Build Python Container"

    params {
        param("kotlin-website-image", "registry.jetbrains.team/p/aki/kotlin-website/kotlinlang/python:%build.number%")
        param("kotlin-website-setup", "/kotlin-website-setup.sh")
        param("virtualenv.folder", "/_environment-kotlin-website")
        param("kotlin-website-node-version", "lts")
        param("env.DOCKER_BUILDKIT", "1")
    }

    vcs {
        root(vcsRoots.KotlinLangOrg, """
            +:. => .
            -:.idea
            -:assets
            -:data
            -:external
            -:kotlin-features
            -:pages
            -:pdf
            -:scripts
            -:src
            -:static
            -:templates
            -:tests
            -:docs
        """.trimIndent())
        cleanCheckout = true
        showDependenciesChanges = true
    }

    steps {
        dockerCommand {
            name = "Build Image"
            commandType = build {
                source = content {
                    content = """
                        FROM registry.jetbrains.team/p/aki/kotlin-website/build:v3
                        
                        # Base image content: registry.jetbrains.team/p/aki/kotlin-website/build:v3
                        # FROM --platform="linux/amd64" python:3.9
                        # ENV DEBIAN_FRONTEND=noninteractive;
                        # RUN pip install --no-cache-dir virtualenv;
                        # COPY google-credentials.json /secrets/google-credentials.json
                        # RUN apt-get update
                        # RUN apt-get install -y build-essential xorg gdebi
                        # RUN apt-get -y install ruby
                        # RUN gem install kramdown -v 1.14.0
                        #
                        # RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && \
                        #       tar xf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && \
                        #       mv wkhtmltox/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf && \
                        #       chmod +x /usr/local/bin/wkhtmltopdf
                        
                        RUN curl -fsSL "https://deb.nodesource.com/setup_%kotlin-website-node-version%.x" | bash
                        RUN apt-get install -y nodejs
                        
                        RUN \
                           echo "Initializing infrastructure at %virtualenv.folder%"; \
                           virtualenv -p python3 %virtualenv.folder%;
                        
                        RUN \
                           pip install --upgrade pip
                        
                        RUN \
                            echo "source %virtualenv.folder%/bin/activate" > %kotlin-website-setup%; \
                            chmod +x %kotlin-website-setup%
                        
                        ADD requirements.txt /requirements.txt
                        RUN pip install -r /requirements.txt; rm /requirements.txt
                    """.trimIndent()
                }
                platform = DockerCommandStep.ImagePlatform.Linux
                namesAndTags = "%kotlin-website-image%"
                commandArgs = "--pull"
            }
        }
        script {
            name = "Test container"
            scriptContent = """
                #!/bin/bash
                
                echo "setup script:"
                cat %kotlin-website-setup%
                echo ""
                
                source %kotlin-website-setup%
                
                set -e -x -u
                
                python --version
                
                pip --version
                
                node --version
                
                npm --version
                
                kramdown --version
            """.trimIndent()
            dockerImage = "%kotlin-website-image%"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        dockerCommand {
            name = "Push image"
            commandType = push {
                namesAndTags = "%kotlin-website-image%"
            }
        }
        script {
            name = "Update build Status"
            scriptContent = """
                #!/bin/bash
                
                echo " ##teamcity[buildStatus text='{build.status.text} %kotlin-website-image%'] "
            """.trimIndent()
        }
    }

    features {
        dockerRegistryConnections {
            cleanupPushedImages = true
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_357"
            }
        }
    }
})
