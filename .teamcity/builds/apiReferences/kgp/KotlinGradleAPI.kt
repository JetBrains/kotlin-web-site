package builds.apiReferences.kgp

import builds.apiReferences.*
import jetbrains.buildServer.configs.kotlin.buildSteps.script

private const val REPO = "https://github.com/JetBrains/kotlin.git"
private const val OUTPUT_DIR = "libraries/tools/gradle/documentation/build/documentation/kotlinlang"
private const val TEMPLATES_DIR = "build/api-reference/templates"
private const val PREVIOUS_DIR = "libraries/tools/gradle/documentation/build/documentation/kotlinlangOld"

class KotlinGradleAPI(init: KotlinGradleAPI.() -> Unit) : ReferenceProject("kotlin-gradle-plugin") {
    init {
        init()
        build()
    }

    fun addVersion(version: String, tagsOrBranch: String, templateVersion: String? = null) {
        addReference(version) { project, version ->
            val vcs = makeReferenceVcs(version, REPO, tagsOrBranch)
            val template = TemplateDep(TEMPLATES_DIR, makeReferenceTemplate(version, urlPart, templateVersion))
            val pages = makeReferencePages(version, OUTPUT_DIR, vcs, template) {
                script {
                    name = "Build API reference pages"
                    //language=bash
                    scriptContent = """
                        #!/bin/bash
                        set -e -u
                        ./gradlew :gradle:documentation:dokkaKotlinlangDocumentation \
                            -PdeployVersion="$version" --no-daemon --no-configuration-cache
                    """.trimIndent()
                }
            }

            pages.apply {
                params {
                    param("OLD_VERSIONS_DIR", PREVIOUS_DIR)
                }
            }
        }
    }
}
