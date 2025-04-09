package builds.references.apis

import builds.common.ReferenceProject
import builds.common.VCS
import builds.common.makeAPIReference

class KotlinxIO(version: String, tagOrBranch: String = VCS.tag(version)) : ReferenceProject("kotlinx-io") {
    init {
        addReference(version) {
            makeAPIReference(
                version,
                gitUrl = "git@github.com:Kotlin/kotlinx-io.git",
                gitBranch = tagOrBranch
            )
        }
    }
}