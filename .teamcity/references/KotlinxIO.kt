package references

import references.common.ReferenceProject
import references.common.VCS
import references.common.makeAPIReference

class KotlinxIO(version: String, tagOrBranch: String = VCS.tag(version)) : ReferenceProject("kotlinx-io") {
    init {
        makeAPIReference(
            version,
            gitUrl = "git@github.com:Kotlin/kotlinx-io.git",
            gitBranch = tagOrBranch
        )
    }
}
