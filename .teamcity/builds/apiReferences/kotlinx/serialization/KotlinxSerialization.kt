package builds.apiReferences.kotlinx.serialization

import builds.apiReferences.ReferenceProject
import builds.apiReferences.VCS
import builds.apiReferences.makeAPIReference
import builds.apiReferences.scriptBuildHtml

class KotlinxSerialization(
    version: String, tagOrBranch: String = VCS.branch("master")
) : ReferenceProject("kotlinx.serialization") {
    init {
        makeAPIReference(
            version = version,
            gitUrl = "git@github.com:Kotlin/kotlinx.serialization.git",
            gitBranch = tagOrBranch,
            steps = {
                step(scriptBuildHtml(version) {
                    tasks = ":dokkaHtmlMultiModule"
                })
            })
    }
}
