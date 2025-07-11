package common.extensions

import common.ReferenceProject
import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildSteps.GradleBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot
import vcsRoots.KotlinLangVcs

const val DEFAULT_DOKKA_PATH = "build/dokka/htmlMultiModule"

fun ReferenceProject.referenceVcs(version: String, vcsUrl: String, tagOrBranch: String) = GitVcsRoot {
    id = RelativeId("${projectPrefix}_${version.replace(".", "")}_Vcs")
    name = version

    url = vcsUrl

    branch = tagOrBranch
    useTagsAsBranches = true
    branchSpec = ""

    authMethod = uploadedKey {
        uploadedKey = "teamcity"
    }
}.also {
    this.project.vcsRoot(it)
}

fun ReferenceProject.referenceTemplate(apiVersion: String, algoliaIndex: String, tagOrBranch: String? = null) =
    BuildType {
        configureReferenceTemplate()

        id = RelativeId("${projectPrefix}_${apiVersion.replace(".", "")}_Template")
        name = "$apiVersion templates"
        description = "Build Dokka Templates for $projectName"

        val templateVcs = KotlinLangVcs {
            id = RelativeId("${projectPrefix}_${apiVersion.replace(".", "")}_Template_Vcs")
            name = "$apiVersion templates vcs"
            branch = tagOrBranch ?: VCS.branch("master")
            branchSpec = ""
        }

        vcs {
            root(templateVcs.also {
                project.vcsRoot(it)
            })
        }

        params {
            param("env.ALGOLIA_INDEX_NAME", algoliaIndex)
        }
    }.also {
        this.project.buildType(it)
    }

class TemplateDep(val build: BuildType, val dir: String? = null)

fun ReferenceProject.referencePages(
    version: String,
    outputDir: String = DEFAULT_DOKKA_PATH,
    vcsRoot: VcsRoot? = null,
    template: TemplateDep? = null,
    steps: (BuildSteps.() -> Unit)? = null
) = BuildType {
    id = RelativeId("${projectPrefix}_${version.replace(".", "")}_Build")
    name = "$version pages"
    description = "Build pages for $projectName"

    requirements {
        doesNotContain("docker.server.osType", "windows")
    }

    artifactRules = """
        $outputDir/** => pages.zip
        -:$outputDir/not-found-version.html
    """.trimIndent()

    if (vcsRoot != null) {
        vcs {
            root(vcsRoot)
        }
    }

    if (template != null) {
        dependencies {
            dependsOnDokkaTemplate(template.build, template.dir)
        }
    }

    steps {
        when {
            steps != null -> steps()
            else -> dokkaBuildHtml(version)
        }
    }
}.also { this.project.buildType(it) }

fun ReferenceProject.apiReference(
    version: String,
    gitUrl: String,
    gitBranch: String,
    templateVersion: String? = null,
    templateDir: String? = null,
    pagesDir: String = DEFAULT_DOKKA_PATH,
    previousVersionDir: String? = null,
    steps: (BuildSteps.() -> Unit)? = null,
): BuildType {
    val vcs = referenceVcs(version, gitUrl, gitBranch)
    val template = referenceTemplate(version, urlPart, templateVersion)

    return referencePages(version, pagesDir, vcs, TemplateDep(template, templateDir), steps).apply {
        if (previousVersionDir != null) {
            params {
                param("OLD_VERSIONS_DIR", previousVersionDir)
            }
        }
    }
}

fun Dependencies.dependsOnDokkaTemplate(build: BuildType, artifactPath: String? = null) {
    dependency(build) {
        snapshot {
            onDependencyFailure = FailureAction.FAIL_TO_START
            onDependencyCancel = FailureAction.CANCEL
        }
        artifacts {
            artifactRules = "+:dokka-templates/** => ${artifactPath ?: "dokka-templates"}"
            cleanDestination = true
        }
    }
}

fun BuildTypeSettings.configureReferenceTemplate() {
    artifactRules = """
        dokka-templates/** => dokka-templates
    """.trimIndent()

    requirements {
        doesNotContain("teamcity.agent.name", "windows")
    }

    steps {
        script {
            id = "step-npm-sharp-platform"
            name = "Fix npm sharp platform related issue"
            //language=sh
            scriptContent = """
                rm -rf node_modules/sharp
            """.trimIndent()
        }
        script {
            id = "step-install-dependencies"
            name = "Install dependencies"
            //language=sh
            scriptContent = """
                yarn install --frozen-lockfile
            """.trimIndent()
            dockerImage = "node:18-alpine"
        }
        script {
            id = "step-build-templates"
            name = "Build Templates"
            //language=sh
            scriptContent = """
                node ./scripts/dokka/generate-templates.js
            """.trimIndent()
            dockerImage = "node:18-alpine"
        }
    }
}

fun BuildSteps.dokkaBuildHtml(version: String? = null, init: GradleBuildStep.() -> Unit = {}): BuildStep = gradle {
    id = "step-build-dokka-html-id"
    name = "Build dokka html"
    tasks = "dokkaHtmlMultiModule"
    gradleParams = "${if (version != null) """-PdeployVersion=$version """ else ""}--no-daemon --no-configuration-cache"
    useGradleWrapper = true
}.apply(init)
