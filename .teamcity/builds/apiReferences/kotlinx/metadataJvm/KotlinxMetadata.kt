package builds.apiReferences.kotlinx.metadataJvm

import builds.apiReferences.ReferenceProject
import builds.apiReferences.VCS
import builds.apiReferences.makeAPIReference
import builds.apiReferences.scriptBuildHtml

private const val LIB_DIR = "libraries/kotlinx-metadata/jvm"

class KotlinxMetadata(
    version: String, tagOrBranch: String = VCS.tag(version)
) : ReferenceProject("kotlinx-metadata-jvm") {
    init {
        makeAPIReference(
            version = version,
            gitUrl = "git@github.com:JetBrains/kotlin.git",
            gitBranch = tagOrBranch,
            templateDir = "$LIB_DIR/dokka-templates",
            pagesDir = "$LIB_DIR/build/dokka",
            steps = {
                step(scriptBuildHtml(version) {
                    tasks = ":kotlin-metadata-jvm:dokkaHtml"
                })
            })
    }
}
