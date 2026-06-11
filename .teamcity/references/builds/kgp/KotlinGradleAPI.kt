package references.builds.kgp

import common.ReferenceProject
import common.extensions.apiReference
import common.extensions.dokkaBuildHtml

private const val KGP_TITLE = "Kotlin Gradle Plugin"

class KotlinGradleAPI(init: KotlinGradleAPI.() -> Unit) : ReferenceProject("kotlin-gradle-plugin", KGP_TITLE) {
    init {
        init()
        build()
    }

    fun addV1Version(version: String, tagsOrBranch: String) =
        addVersion(version, tagsOrBranch, ":gradle:documentation:dokkaKotlinlangDocumentation")

    fun addVersion(version: String, tagsOrBranch: String) =
        addVersion(version, tagsOrBranch, ":gradle:documentation:dokkaGenerateModuleHtml")

    private fun addVersion(version: String, tagsOrBranch: String, task: String? = null) = addReference(version) {
        apiReference(
            version = version,
            gitBranch = tagsOrBranch,
            gitUrl = "git@github.com:JetBrains/kotlin.git",
            templateDir = "build/api-reference/templates",
            pagesDir = "libraries/tools/gradle/documentation/build/documentation/kotlinlang",
            previousVersionDir = "libraries/tools/gradle/documentation/build/documentation/kotlinlangOld",
        ) {
            dokkaBuildHtml(version) {
                tasks = task
                gradleParams = "$gradleParams -Pteamcity=true"
            }
        }
    }
}
