package builds.references.apis

import builds.common.ReferenceProject
import builds.common.VCS
import builds.common.dokkaBuildHtml
import builds.common.makeAPIReference

private const val LIB_DIR = "libraries/kotlinx-metadata/jvm"

class KotlinxMetadata(
    version: String, tagOrBranch: String = VCS.tag("v$version")
) : ReferenceProject("kotlinx-metadata-jvm") {
    init {
        addReference(version) {
            makeAPIReference(
                version,
                gitUrl = "git@github.com:JetBrains/kotlin.git",
                gitBranch = tagOrBranch,
                templateDir = "${LIB_DIR}/dokka-templates",
                pagesDir = "${LIB_DIR}/build/dokka",
                steps = {
                    step(dokkaBuildHtml(version) {
                        tasks = ":kotlin-metadata-jvm:dokkaHtml"
                    })
                })
        }
    }
}