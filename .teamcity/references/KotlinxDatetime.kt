package references

import builds.apiReferences.scriptBuildHtml
import references.common.ReferenceProject
import references.common.VCS
import references.common.makeAPIReference

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
