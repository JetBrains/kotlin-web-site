package builds.references.apis

import builds.common.ReferenceProject
import builds.common.VCS
import builds.common.dokkaBuildHtml
import builds.common.makeAPIReference

class KotlinxSerialization(
    version: String, tagOrBranch: String = VCS.branch("master")
) : ReferenceProject("kotlinx.serialization") {
    init {
        makeAPIReference(
            version = version,
            gitUrl = "git@github.com:Kotlin/kotlinx.serialization.git",
            gitBranch = tagOrBranch,
            steps = {
                step(dokkaBuildHtml(version) {
                    tasks = ":dokkaHtmlMultiModule"
                })
            })
    }
}