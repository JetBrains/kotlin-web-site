package builds.apiReferences.kotlinx.coroutines

import builds.apiReferences.ReferenceProject
import builds.apiReferences.VCS
import builds.apiReferences.makeAPIReference

class KotlinxCoroutines(
    version: String, tagOrBranch: String = VCS.branch("master")
) : ReferenceProject("kotlinx.coroutines") {
    init {
        makeAPIReference(
            version,
            gitUrl = "git@github.com:Kotlin/kotlinx.coroutines.git",
            gitBranch = tagOrBranch,
        )
    }
}
