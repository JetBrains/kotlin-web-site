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
                name = "fix reference links"

                workingDir = "artifacts"
                //language=sh
                scriptContent = """
                    #!/bin/sh
                    set -e
                    
                    apk add zip unzip
                    unzip webHelpMPD2.zip -d archive
                    
                    cd archive
                    
                    cp -f config.json temp.json
                    sed '1s/"productId":/"searchProductId":"help\/kotlin-reference","productId":/' temp.json > config.json
                    rm temp.json
                    
                    html_files=$(find . -type f -name '*.html')
                    for file in ${'$'}html_files; do
                        echo "Processing ${'$'}file"
                        sed -i 's|href="https://kotlinlang.org/docs/|href="/docs/|g' "${'$'}file"
                        sed -i 's|href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/|href="/docs/multiplatform/|g' "${'$'}file"
                    done

                    json_files=$(find . -type f -name '*.json')
                    for file in ${'$'}json_files; do
                        echo "Processing ${'$'}file"
                        sed -i 's|"url":"https://kotlinlang.org/docs/|"url": "/docs/|g' "${'$'}file"
                        sed -i 's|"url":"https://www.jetbrains.com/help/kotlin-multiplatform-dev/|"url": "/docs/multiplatform/|g' "${'$'}file"
                    done
                    
                    zip -ru ../webHelpMPD2.zip .
                    
                    cd ../ && rm -rf archive
                """.trimIndent()

                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerImage = "alpine:latest"
            }
        }
    }
)
