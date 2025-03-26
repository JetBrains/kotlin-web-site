package builds.apiReferences.kgp

import BuildParams.KGP_API_TITLE
import builds.apiReferences.ReferenceProject
import builds.apiReferences.VCS
import builds.apiReferences.makeAPIReference
import builds.apiReferences.scriptBuildHtml

class KotlinGradlePlugin(init: KotlinGradlePlugin.() -> Unit) : ReferenceProject("kotlin-gradle-plugin", KGP_API_TITLE) {
    init {
        init()
    }

    fun addVersion(version: String, tagOrBranch: String = VCS.tag("v$version"), templateVersion: String? = null) {
        addReference(version) { project, version ->
            makeAPIReference(
                version,
                gitUrl = "git@github.com:JetBrains/kotlin.git",
                gitBranch = tagOrBranch,
                templateVersion = templateVersion,
                templateDir = "build/api-reference/templates",
                pagesDir = "libraries/tools/gradle/documentation/build/documentation/kotlinlang",
                previousVersionDir = "libraries/tools/gradle/documentation/build/documentation/kotlinlangOld",
                steps = {
                    step(scriptBuildHtml(version) {
                        tasks = ":gradle:documentation:dokkaKotlinlangDocumentation"
                    })
                }
            )
        }
    }
}
