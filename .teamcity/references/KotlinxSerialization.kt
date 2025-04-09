package references

import builds.apiReferences.scriptBuildHtml
import references.common.ReferenceProject
import references.common.VCS
import references.common.makeAPIReference

class KotlinxSerialization(
    version: String, tagOrBranch: String = VCS.branch("master")
) : ReferenceProject("kotlinx.serialization") {
    init {
        makeAPIReference(
            version = version,
            gitUrl = "git@github.com:Kotlin/kotlinx.serialization.git",
            gitBranch = tagOrBranch,
            steps = {
                step(scriptBuildHtml(version) {
                    tasks = ":dokkaHtmlMultiModule"
                })
            })
    }
}
