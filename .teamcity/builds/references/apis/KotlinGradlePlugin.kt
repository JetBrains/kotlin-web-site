package builds.references.apis

import BuildParams
import builds.common.ReferenceProject
import builds.common.VCS
import builds.common.dokkaBuildHtml
import builds.common.makeAPIReference

typealias KGPSetup = KotlinGradlePlugin.() -> Unit

class KotlinGradlePlugin(init: KGPSetup) :
    ReferenceProject("kotlin-gradle-plugin", BuildParams.KGP_API_TITLE) {

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
                    step(dokkaBuildHtml(version) {
                        tasks = ":gradle:documentation:dokkaKotlinlangDocumentation"
                    })
                })
        }
    }
}