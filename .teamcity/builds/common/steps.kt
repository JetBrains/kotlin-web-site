package builds.common

import builds.kotlinlang.templates.scriptDistAnalyze
import jetbrains.buildServer.configs.kotlin.BuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.GradleBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep

const val DEFAULT_DOKKA_PATH = "build/dokka/htmlMultiModule"

fun dokkaBuildHtml(version: String? = null, init: GradleBuildStep.() -> Unit = {}): BuildStep = GradleBuildStep {
    id = "step-build-dokka-html-id"
    name = "Build dokka html"
    tasks = "dokkaHtmlMultiModule"
    gradleParams = "${if (version != null) "-PdeployVersion=\"$version\" " else ""}--no-daemon --no-configuration-cache"
    useGradleWrapper = true
}.apply(init)

fun scriptGenerateSitemap(pagesRoot: String = DEFAULT_DOKKA_PATH): BuildStep = scriptDistAnalyze {
    //language=sh
    scriptContent += "\n" + """
        cd ../../dist
        cp ./sitemap.xml "../$pagesRoot/"
    """.trimIndent()
}

fun scriptNoRobots(pagesRoot: String, block: ScriptBuildStep.() -> Unit = {}) = ScriptBuildStep {
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
