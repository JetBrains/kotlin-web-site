package common.extensions

import jetbrains.buildServer.configs.kotlin.BuildStep
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script

fun BuildSteps.scriptGenerateSitemap(pagesRoot: String = DEFAULT_DOKKA_PATH): BuildStep = script {
    //language=sh
    scriptContent += "\n" + """
        cd ../../dist
        cp ./sitemap.xml "../$pagesRoot/"
    """.trimIndent()
}

fun BuildSteps.scriptNoRobots(pagesRoot: String, block: ScriptBuildStep.() -> Unit = {}) = script {
    name = "Add no robots for older versions"
    workingDir = pagesRoot
    //language=sh
    scriptContent = """
        # replace with print
        find . -type f \( -regex '\./\(older/\)\?[0-9]\+\.[0-9]\+\([0-9]\+\)\?.\+\.html${'$'}' \) \
            -exec sed -i -E 's/(<head[^>]*>)/\1<meta name="robots" content="noindex, nofollow">/g' {} \;
    """.trimIndent()
    dockerImage = "alpine"
}.apply(block)
