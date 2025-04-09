package references.common

import builds.apiReferences.DEFAULT_DOKKA_PATH
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.scriptBuildHtml
import builds.apiReferences.templates.configureReferenceTemplate
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.RelativeId
import jetbrains.buildServer.configs.kotlin.VcsRoot
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot
import vcsRoots.KotlinLangVcs

object VCS {
    fun tag(name: String) = "refs/tags/$name"
    fun branch(name: String) = "refs/heads/$name"
}

fun ReferenceProject.makeReferenceVcs(version: String, vcsUrl: String, tagOrBranch: String) = GitVcsRoot {
    id = RelativeId("${project.id}_${version.replace(".", "")}_Vcs")
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

fun ReferenceProject.makeReferenceTemplate(apiVersion: String, algoliaIndex: String, tagOrBranch: String? = null) =
    BuildType {
        configureReferenceTemplate()

        id = RelativeId("${project.id}_${apiVersion.replace(".", "")}_Template")
        name = "$apiVersion templates"
        description = "Build Dokka Templates for $projectName"

        val templateVcs = KotlinLangVcs {
            id = RelativeId("${project.id}_${apiVersion.replace(".", "")}_Template_Vcs")
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

fun ReferenceProject.makeReferencePages(
    version: String,
    outputDir: String = DEFAULT_DOKKA_PATH,
    vcsRoot: VcsRoot? = null,
    template: TemplateDep? = null,
    steps: BuildSteps.() -> Unit = { step(scriptBuildHtml(version)) }
) = BuildType {
    id = RelativeId("${project.id}_${version.replace(".", "")}_Build")
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
        steps()
    }
}.also { this.project.buildType(it) }

fun ReferenceProject.makeAPIReference(
    version: String,
    gitUrl: String,
    gitBranch: String,
    templateVersion: String? = null,
    templateDir: String? = null,
    pagesDir: String = DEFAULT_DOKKA_PATH,
    previousVersionDir: String? = null,
    steps: BuildSteps.() -> Unit = {},
): BuildType {
    val vcs = makeReferenceVcs(version, gitUrl, gitBranch)
    val template = makeReferenceTemplate(version, urlPart, templateVersion)

    return makeReferencePages(version, pagesDir, vcs, TemplateDep(template, templateDir), steps).apply {
        if (previousVersionDir != null) {
            params {
                param("OLD_VERSIONS_DIR", previousVersionDir)
            }
        }
    }
}
