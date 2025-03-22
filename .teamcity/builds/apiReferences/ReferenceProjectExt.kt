package builds.apiReferences

import builds.apiReferences.templates.PrepareDokkaTemplate
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.RelativeId
import jetbrains.buildServer.configs.kotlin.VcsRoot
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

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

fun ReferenceProject.makeReferenceTemplate(version: String, algoliaIndex: String) = BuildType {
    id = RelativeId("${project.id}_${version.replace(".", "")}_Template")
    name = "$version templates"
    description = "Build Dokka Templates for $projectName"

    templates(PrepareDokkaTemplate)

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
