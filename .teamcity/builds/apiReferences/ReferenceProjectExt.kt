package builds.apiReferences

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

fun ReferenceProject.makeReferenceTemplate(apiVersion: String, algoliaIndex: String, tagsOrBranch: String? = null) =
    BuildType {
        configureReferenceTemplate()

        id = RelativeId("${project.id}_${apiVersion.replace(".", "")}_Template")
        name = "$apiVersion templates"
        description = "Build Dokka Templates for $projectName"

        val templateVcs = KotlinLangVcs {
            id = RelativeId("${project.id}_${apiVersion.replace(".", "")}_Template_Vcs")
            name = "$apiVersion templates vcs"
            branch = tagsOrBranch ?: VCS.branch("master")
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

class TemplateDep(val dir: String, val build: BuildType)

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
