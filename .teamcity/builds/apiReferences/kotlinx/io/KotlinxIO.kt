package builds.apiReferences.kotlinx.io

import builds.apiReferences.ReferenceProject
import builds.apiReferences.VCS
import builds.apiReferences.makeAPIReference

class KotlinxIO(version: String, tagOrBranch: String = VCS.tag(version)) : ReferenceProject("kotlinx-io") {
    init {
        makeAPIReference(
            version,
            gitUrl = "git@github.com:Kotlin/kotlinx-io.git",
            gitBranch = tagOrBranch
        )
    }
}
