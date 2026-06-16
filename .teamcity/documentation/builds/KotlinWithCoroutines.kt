package documentation.builds

import documentation.vcsRoots.*
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.CheckoutMode
import jetbrains.buildServer.configs.kotlin.VcsRoot
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

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

            checkoutMode = CheckoutMode.ON_AGENT
            cleanCheckout = true
        }
    }
) {
    init {
        addSubDocumentation("dokka", DokkaRoot)
        addSubDocumentation("api-guidelines", APIGuidelinesRoot)
        addSubDocumentation("kotlinx.coroutines", KotlinxCoroutinesRoot)
        addSubDocumentation("kotlinx-lincheck", KotlinxLincheckRoot, """
            +:.git => kotlinx-lincheck/.git
            +:docs => kotlinx-lincheck/docs
            +:lincheck => kotlinx-lincheck/lincheck
        """.trimIndent())
    }
}

/**
 * Adds a sub-documentation additional setting to this build type.
 *
 * @param checkoutDir the directory to check out the sub-documentation into
 * @param root the VCS root to use for the sub-documentation
 * @param rules the checkout rules to use for the sub-documentation
 */
private fun BuildType.addSubDocumentation(
    checkoutDir: String,
    root: VcsRoot,
    rules: String? = null
) {
    vcs.root(root, rules ?: """
        +:.git => $checkoutDir/.git
        +:docs => $checkoutDir/docs
    """.trimIndent())

    steps.items.add(0, ScriptBuildStep {
        name = "Create docs/snippets for '$checkoutDir'"

        // language=bash
        scriptContent = """
            FILE_NAME="$checkoutDir/docs/snippets/*"
            
            if [ -f "${'$'}FILE_NAME" ]; then
                echo "Creating symlink for ${'$'}FILE_NAME"
                ln -s "${'$'}FILE_NAME" "./docs/snippets/"
            fi
        """.trimIndent()

        dockerImage = "alpine:latest"
    })
}
