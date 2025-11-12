package documentation.builds

import documentation.vcsRoots.*
import jetbrains.buildServer.configs.kotlin.CheckoutMode
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script

//import jetbrains.buildServer.configs.kotlin.BuildType
//import jetbrains.buildServer.configs.kotlin.FailureAction
//import jetbrains.buildServer.configs.kotlin.buildSteps.script

object KotlinWithCoroutines: WritersideBuilder(
    module = "kotlin-reference",
    instance = "kr",
    customInit = {
        name ="Kotlin Reference with coroutines"
        vcs {
            root(KotlinReferenceRoot, """
            +:docs => docs
            +:.git => .git
            +:.gitmodules => .gitmodules
        """.trimIndent())
            root(KotlinxCoroutinesRoot,"""
            +:docs => kotlinx.coroutines/docs
            +:.git => kotlinx.coroutines/.git
        """.trimIndent())
            root(KotlinxLincheckRoot, """
            +:docs => kotlinx-lincheck/docs
            +:.git => kotlinx-lincheck/.git
        """.trimIndent())
            root(DokkaRoot, """
            +:docs => dokka/docs
            +:.git => dokka/.git
        """.trimIndent())
            root(APIGuidelinesRoot, """
            +:docs => api-guidelines/docs
            +:.git => api-guidelines/.git
        """.trimIndent())

            checkoutMode = CheckoutMode.ON_AGENT
            cleanCheckout = true
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
                    ls -la
                    unzip webHelpKR2.zip -d archive
                    
                    cd archive
                    
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
                    
                    zip -ru ../webHelpKR2.zip .
                    
                    cd ../ && rm -rf archive
                """.trimIndent()

                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerImage = "alpine:latest"
            }

        }
    }
)
