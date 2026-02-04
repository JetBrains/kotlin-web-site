package references.builds.compose

import common.ReferenceProject
import common.extensions.apiReference
import common.extensions.dokkaBuildHtml
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.Dependency
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

data class AndroidSdk(
    val compileSdk: String,
    val buildTools: String,
    val cmdToolsVersion: String,
)

// Download Android SDK
// https://code.jetbrains.team/p/ui/repositories/compose-teamcity-config/files/main/.teamcity/compose/scripts/downloadAndroidSdk.sh
private fun BuildSteps.downloadAndroidSdk(androidSdk: AndroidSdk) = script {
    name = "Download Android SDK"
    // language=bash
    scriptContent = """
        #!/bin/bash
        set -euo pipefail
        
        ANDROID_COMPILE_SDK=${androidSdk.compileSdk}
        ANDROID_BUILD_TOOLS=${androidSdk.buildTools}
        ANDROID_CMD_TOOLS_VERSION=${androidSdk.cmdToolsVersion}
        
        downloadLinuxSDK() {
            curl --silent --show-error -o commandlinetools-linux.zip https://dl.google.com/android/repository/commandlinetools-linux-${'$'}{ANDROID_CMD_TOOLS_VERSION}_latest.zip
            unzip -o -d android-sdk-linux commandlinetools-linux.zip
            rm commandlinetools-linux.zip
            echo y | "android-sdk-linux/cmdline-tools/bin/sdkmanager" --sdk_root=android-sdk-linux "platform-tools" "platforms;android-${'$'}ANDROID_COMPILE_SDK" "build-tools;${'$'}ANDROID_BUILD_TOOLS"
            echo y | "android-sdk-linux/cmdline-tools/bin/sdkmanager" --sdk_root=android-sdk-linux --licenses > /dev/null
            export ANDROID_HOME=${'$'}PWD/android-sdk-linux
        }
        
        downloadMacOsSDK() {
            curl --silent --show-error -o commandlinetools-mac.zip https://dl.google.com/android/repository/commandlinetools-mac-${'$'}{ANDROID_CMD_TOOLS_VERSION}_latest.zip
            unzip -o -d android-sdk-darwin commandlinetools-mac.zip
            rm commandlinetools-mac.zip
            echo y | "android-sdk-darwin/cmdline-tools/bin/sdkmanager" --sdk_root=android-sdk-darwin "platform-tools" "platforms;android-${'$'}ANDROID_COMPILE_SDK" "build-tools;${'$'}ANDROID_BUILD_TOOLS"
            echo y | "android-sdk-darwin/cmdline-tools/bin/sdkmanager" --sdk_root=android-sdk-darwin --licenses > /dev/null
            export ANDROID_HOME=${'$'}PWD/android-sdk-darwin
        }
        
        if [[ "${'$'}OSTYPE" == "linux-gnu"* ]]; then
            downloadLinuxSDK
        elif [[ "${'$'}OSTYPE" == "darwin"* ]]; then
            downloadMacOsSDK
        elif [[ "${'$'}OSTYPE" == "cygwin" ]]; then
            echo "Please download Android SDK manually (https://developer.android.com/studio)"
        elif [[ "${'$'}OSTYPE" == "msys" ]]; then
            echo "Please download Android SDK manually (https://developer.android.com/studio)"
        elif [[ "${'$'}OSTYPE" == "win32" ]]; then
            echo "Please download Android SDK manually (https://developer.android.com/studio)"
        else
            echo "Unknown OS"
        fi
        
        # Export ANDROID_HOME as for other build steps
        echo "ANDROID_HOME=${'$'}ANDROID_HOME"
        echo "##teamcity[setParameter name='env.ANDROID_HOME' value='${'$'}ANDROID_HOME']"
    """.trimIndent()
    formatStderrAsError = true
}
// ----------

class ComposeMultiplatformCore(init: ComposeMultiplatformCore.() -> Unit) : ReferenceProject("compose-multiplatform") {
    init {
        init()
        build()
    }

    override fun makeLatestDependency(workingDir: String): Dependency.() -> Unit {
        return {
            artifacts {
                buildRule = tag("release")
                artifactRules = "pages.zip!** => $workingDir"
                cleanDestination = true
            }
        }
    }

    fun addVersion(version: String, tagOrBranch: String, androidSdk: AndroidSdk) = addReference(version) {
        apiReference(
            version,
            gitUrl = "git@github.com:JetBrains/compose-multiplatform-core.git",
            gitBranch = tagOrBranch,
            templateDir = "mpp/apiReferences/dokka-templates",
            pagesDir = "out/androidx/mpp/apiReferences/build/dokka/html",
            steps = {
                downloadAndroidSdk(androidSdk)
                dokkaBuildHtml(version) {
                    tasks = ":mpp:apiReferences:buildApiReferencesWithStories"
                    gradleParams += " -PapiReferences.storiesRootPath=/api/${urlPart}/stories"
                    jdkHome = "%env.JDK_21_0%"
                }
            }
        ).additionalParams()
    }
}
