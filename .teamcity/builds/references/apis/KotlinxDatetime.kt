package builds.references.apis

import builds.common.ReferenceProject
import builds.common.VCS
import builds.common.dokkaBuildHtml
import builds.common.makeAPIReference

class KotlinxDatetime(
    version: String, tagOrBranch: String = VCS.branch("latest-release")
) : ReferenceProject("kotlinx-datetime") {
    init {
        makeAPIReference(
            version,
            gitUrl = "git@github.com:Kotlin/kotlinx-datetime.git",
            gitBranch = tagOrBranch,
            pagesDir = "core/build/dokka/html",
            steps = {
                step(dokkaBuildHtml(version) {
                    tasks = ":kotlinx-datetime:dokkaHtml"
                })
            })
    }
}