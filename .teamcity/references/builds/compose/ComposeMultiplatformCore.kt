package references.builds.compose

import common.ReferenceProject
import common.extensions.dokkaBuildHtml
import common.extensions.apiReference
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

// Copy build setting from:
//   https://code.jetbrains.team/p/ui/repositories/compose-teamcity-config/files/e37888bd0bdac1543a3c7ceae9e2d4331e9f6a96/.teamcity/compose/pullRequests/CheckApi.kt?tab=source
// ----------
private fun BuildType.additionalParams(): BuildType = apply {
    params {
        param("env.GRADLE_OPTS", "-Xmx10536m")
        param("env.ANDROID_HOME", "%teamcity.build.checkoutDir%/fullsdk-darwin")
    }
    requirements {
        noLessThan("teamcity.agent.hardware.memorySizeMb", "15000")
        contains("teamcity.agent.jvm.os.name", "Mac OS X")
        contains("teamcity.agent.jvm.os.arch", "aarch64")
    }
}

private fun BuildSteps.downloadAndroidSdk() = script {
    name = "Download Android SDK"
    // language=bash
    scriptContent = """
        #!/bin/bash
        set -euo pipefail
        ./jbdeps/android-sdk/downloadAndroidSdk
    """.trimIndent()
    formatStderrAsError = true
}
// ----------

class ComposeMultiplatformCore(init: ComposeMultiplatformCore.() -> Unit) : ReferenceProject("compose-multiplatform") {
    init {
        init()
        build()
    }

    fun addVersion(version: String, tagOrBranch: String) = addReference(version) {
        apiReference(
            version,
            gitUrl = "git@github.com:JetBrains/compose-multiplatform-core.git",
            gitBranch = tagOrBranch,
            templateDir = "mpp/apiReferences/dokka-templates",
            pagesDir = "out/androidx/mpp/apiReferences/build/dokka/html",
            steps = {
                downloadAndroidSdk()
                dokkaBuildHtml(version) {
                    tasks = ":mpp:apiReferences:buildApiReferencesWithStories"
                    gradleParams += " -PapiReferences.storiesRootPath=/api/${urlPart}/stories"
                    jdkHome = "%env.JDK_17_0%"
                }
            }
        ).additionalParams()
    }
}