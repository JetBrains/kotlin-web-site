package references

import references.common.ReferenceProject
import references.common.VCS
import references.common.makeAPIReference

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
