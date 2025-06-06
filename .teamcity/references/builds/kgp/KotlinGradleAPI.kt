package references.builds.kgp

import BuildParams.KGP_TITLE
import common.ReferenceProject
import common.extensions.apiReference
import common.extensions.dokkaBuildHtml

class KotlinGradleAPI(init: KotlinGradleAPI.() -> Unit) : ReferenceProject("kotlin-gradle-plugin", KGP_TITLE) {
    init {
        init()
        build()
    }

    fun addVersion(version: String, tagsOrBranch: String) = addReference(version) {
        apiReference(
            version = version,
            gitBranch = tagsOrBranch,
            gitUrl = "git@github.com:JetBrains/kotlin.git",
            templateDir = "build/api-reference/templates",
            pagesDir = "libraries/tools/gradle/documentation/build/documentation/kotlinlang",
            previousVersionDir = "libraries/tools/gradle/documentation/build/documentation/kotlinlangOld",
        ) {
            dokkaBuildHtml(version) {
                tasks = ":gradle:documentation:dokkaKotlinlangDocumentation"
            }
        }
    }
}
