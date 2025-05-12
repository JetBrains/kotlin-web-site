package common

import common.extensions.scriptGenerateSitemap
import common.extensions.scriptNoRobots
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.RelativeId
import templates.SCRIPT_PATH
import vcsRoots.KotlinLangOrg

private fun String.camelCase(delim: String = "-", join: String = "") =
    this.split(delim).joinToString(join) { it.replaceFirstChar { char -> char.uppercase() } }

typealias ProjectReferenceBuilder = () -> BuildType

open class ReferenceProject(val urlPart: String, val projectTitle: String = urlPart) {
    init {
        if (urlPart.isBlank()) throw IllegalArgumentException("urlPart cannot be blank")
    }

    val projectName = projectTitle.camelCase(join = " ")

    val projectPrefix = urlPart.camelCase()
    val project = Project {
        id = RelativeId(projectPrefix)
        name = projectName
        description = "Project for https://kotlinlang.org/api/$urlPart/"

        params {
            param("env.ALGOLIA_INDEX_NAME", urlPart)
            param("env.API_REFERENCE_NAME", projectTitle)
        }
    }

    protected val versions = mutableListOf<Pair<BuildType, String>>()

    fun getCurrentVersion(): Pair<BuildType, String>? = this.versions.lastOrNull()

    fun addReference(version: String, buildReference: ProjectReferenceBuilder) {
        versions.add(buildReference() to version)
    }

    fun build() {
        val (currentVersion) = getCurrentVersion()
            ?: throw IllegalStateException("Current version is not set for $projectName")

        val workingDir = "dist/api/$urlPart"

        val pages = BuildType {
            id = RelativeId("${projectPrefix}_Latest")
            name = "API Pages"
            description = "The latest stable version for $projectName"

            artifactRules = "$workingDir/** => pages.zip"

            vcs {
                root(KotlinLangOrg, "${SCRIPT_PATH}/")
            }

            steps {
                step(scriptNoRobots(workingDir))
                step(scriptGenerateSitemap(workingDir))
            }

            dependencies {
                dependency(currentVersion) {
                    snapshot {}
                    artifacts {
                        artifactRules = "pages.zip!** => $workingDir"
                        cleanDestination = true
                    }
                }
            }
        }

        project.apply {
            buildType(pages)
            buildType {
                id = RelativeId("${projectPrefix}_Search")
                name = "API Search Index"
                description = "Build search index for $projectName"

                dependencies {
                    dependency(pages) {
                        snapshot {}
                        artifacts {
                            artifactRules = "pages.zip!** => $workingDir"
                            cleanDestination = true
                        }
                    }
                }
            }
        }

        currentVersion.dependencies {
            for ((previousVersion, version) in versions) {
                if (previousVersion == currentVersion) continue
                artifacts(previousVersion) {
                    buildRule = tag("release")
                    artifactRules = "pages.zip!** => %OLD_VERSIONS_DIR%/$version/"
                    cleanDestination = true
                }
            }
        }
    }
}