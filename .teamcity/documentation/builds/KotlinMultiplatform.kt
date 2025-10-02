package documentation.builds

import documentation.vcsRoots.KotlinMultiplatformVCS
import jetbrains.buildServer.configs.kotlin.CheckoutMode
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinMultiplatform: WritersideBuilder (
    module = "kotlin-multiplatform-docs",
    instance = "mpd",
    customInit = {
        name = "Kotlin Multiplatform Documentation"
        vcs {
            root(KotlinMultiplatformVCS)
            cleanCheckout = true
            checkoutMode = CheckoutMode.ON_AGENT
        }

        steps {
            script {
                name = "Add search productId"

                workingDir = "artifacts"
                //language=sh
                scriptContent = """
                    #!/bin/sh
                    unzip -p webHelpMPD2.zip config.json > config.json
                    
                    cp -f config.json temp.json
                    sed '1s/"productId":/"searchProductId":"help\/kotlin-reference","productId":/' temp.json > config.json
                    rm temp.json
                    
                    apk add zip
                    zip -u webHelpMPD2.zip config.json
                """.trimIndent()

                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerImage = "alpine:latest"
            }
        }
    }
)
