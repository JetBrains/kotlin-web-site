package builds.apiReferences

import BuildParams.DOKKA_TEMPLATES_VERSION
import builds.SCRIPT_PATH
import builds.scriptDistAnalyze
import jetbrains.buildServer.configs.kotlin.BuildStep
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.GradleBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import vcsRoots.KotlinLangOrg

const val DEFAULT_DOKKA_PATH = "build/dokka/htmlMultiModule"
private const val DOKKA_SPACE_REPO = "https://maven.pkg.jetbrains.space/kotlin/p/dokka/dev/"

abstract class BuildApiPages(
    apiId: String,
    releaseTag: String,
    pagesRoot: String = DEFAULT_DOKKA_PATH,

    stepDropSnapshot: BuildSteps.() -> BuildStep? = { scriptDropSnapshot() },
    stepDokkaVersionSync: BuildSteps.() -> BuildStep? = { scriptDokkaVersionSync() },
    stepBuildHtml: BuildSteps.() -> BuildStep? = { scriptBuildHtml() },
    stepNoRobots: BuildSteps.(pagesRoot: String) -> BuildStep? = { pagesRoot -> scriptNoRobots(pagesRoot) },
    stepCopyDokkaApiResult: BuildSteps.(appId: String, pagesRoot: String) -> BuildStep? = { appId, pagesRoot ->
        copyDokkaApiResult(appId, pagesRoot)
    },
    stepSitemapGenerate: BuildSteps.(pagesRoot: String) -> BuildStep? = { pagesRoot ->
        scriptGenerateSitemap(pagesRoot)
    },

    vcsDefaultTrigger: VcsTrigger.() -> Unit = {},
    init: BuildType.() -> Unit = {}
) : BuildType({
    name = "$apiId pages"
    description = "Build pages for /api/$apiId"

    artifactRules = "$pagesRoot/** => pages.zip"

    vcs {
        root(KotlinLangOrg, "$SCRIPT_PATH/")
    }

    params {
        param("release.tag", releaseTag)
        param("DOKKA_TEMPLATES_VERSION", DOKKA_TEMPLATES_VERSION)
    }

    triggers {
        vcs {
            id = "trigger-vcs-default-trigger-id"
            branchFilter = "+:<default>"
        }.apply(vcsDefaultTrigger)
    }

    requirements {
        doesNotContain("docker.server.osType", "windows")
    }

    steps {
        stepDropSnapshot()?.also { step -> step(step) }
        stepDokkaVersionSync()?.also { step -> (step) }
        stepBuildHtml()?.also { step -> step(step) }
        stepNoRobots(pagesRoot)?.also { step -> step(step) }
        stepCopyDokkaApiResult(apiId, pagesRoot)?.also { step -> step(step) }
        stepNoRobots(pagesRoot)?.also { step -> step(step) }
        stepSitemapGenerate(pagesRoot)?.also { step -> step(step) }
    }

    init(this)
})


fun scriptDokkaVersionSync(init: ScriptBuildStep.() -> Unit = {}): BuildStep = ScriptBuildStep {
    id = "step-dokka-version-sync-id"
    name = "Sync dokka version with main repository templates"
    dockerImage = "debian"
    // language=bash
    scriptContent = """
        #!/bin/bash
        sed -i -E "s/^(dokka_version|dokkaVersion)=.+/\1=%DOKKA_TEMPLATES_VERSION%/gi" ./gradle.properties
        find . -name "*.gradle.kts" -exec sed -i -E "s|mavenCentral|maven(url = \"$DOKKA_SPACE_REPO\")\nmavenCentral|" {} \;
        find . -name "*.gradle" -exec sed -i -E "s|mavenCentral|maven \{ url \"$DOKKA_SPACE_REPO\" \}\nmavenCentral|" {} \;
    """.trimIndent()
}.apply(init)

fun scriptDropSnapshot(init: ScriptBuildStep.() -> Unit = {}): BuildStep = ScriptBuildStep {
    id = "step-drop-snapshot-id"
    name = "Drop SNAPSHOT word for deploy"
    dockerImage = "debian"
    // language=bash
    scriptContent = """
        #!/bin/bash
        CURRENT_VERSION="$(sed -E s/^v?//g <<<%release.tag%)"
        sed -i -E "s/^version=.+(-SNAPSHOT)?/version=${'$'}CURRENT_VERSION/gi" ./gradle.properties
    """.trimIndent()
}.apply(init)

fun scriptBuildHtml(version: String? = null, init: GradleBuildStep.() -> Unit = {}): BuildStep = GradleBuildStep {
    id = "step-build-dokka-html-id"
    name = "Build dokka html"
    tasks = "dokkaHtmlMultiModule"
    gradleParams = "${if (version != null) "-PdeployVersion=\"$version\" " else ""}--no-daemon --no-configuration-cache"
    useGradleWrapper = true
}.apply(init)

fun copyDokkaApiResult(
    apiId: String, pagesRoot: String = DEFAULT_DOKKA_PATH, init: ScriptBuildStep.() -> Unit = {}
): BuildStep = ScriptBuildStep {
    val processDir = "dist/api/$apiId"

    id = "copy-dokka-api-result"
    name = "Copy files to $processDir"
    enabled = pagesRoot !== processDir
    //language=sh
    scriptContent = """
        echo "$processDir"
        echo "$pagesRoot"
        rm -rf "dist/"
        mkdir -p "dist/api"
        cp -r "$pagesRoot" "$processDir"
        
        ls -la "dist/api"
        ls -la "$processDir"
    """.trimIndent()
    dockerImage = "alpine"
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
