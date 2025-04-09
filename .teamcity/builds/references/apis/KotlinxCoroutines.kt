package builds.references.apis

import builds.common.ReferenceProject
import builds.common.VCS
import builds.common.makeAPIReference

class KotlinxCoroutines(
    version: String, tagOrBranch: String = VCS.branch("master")
) : ReferenceProject("kotlinx.coroutines") {
    init {
        addReference(version) {
            makeAPIReference(
                version,
                gitUrl = "git@github.com:Kotlin/kotlinx.coroutines.git",
                gitBranch = tagOrBranch,
            )
        }
    }
}