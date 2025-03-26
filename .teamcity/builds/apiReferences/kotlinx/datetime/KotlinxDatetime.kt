package builds.apiReferences.kotlinx.datetime

import builds.apiReferences.ReferenceProject
import builds.apiReferences.VCS
import builds.apiReferences.makeAPIReference
import builds.apiReferences.scriptBuildHtml

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
                step(scriptBuildHtml(version) {
                    tasks = ":kotlinx-datetime:dokkaHtml"
                })
            })
    }
}
