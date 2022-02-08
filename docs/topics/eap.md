[//]: # (title: Participate in the Kotlin Early Access Preview)

You can participate in the Kotlin Early Access Preview (EAP) to try out the latest Kotlin features before they are released.

We ship a few Milestone (_M_) builds before every feature (_1.x_) and incremental (_1.x.y_) release. 

We’ll be very thankful if you find and report bugs to our issue tracker [YouTrack](https://kotl.in/issue). 
It is very likely that we’ll be able to fix them before the final release, which means you won’t need to wait until the next Kotlin release for your issues to be addressed. 

By participating in the Early Access Preview and reporting bugs, you contribute to Kotlin and help us make it better 
for everyone in [the growing Kotlin community](https://kotlinlang.org/community/). We appreciate your help a lot! 

If you have any questions and want to participate in discussions, you are welcome to join the [#eap channel in Kotlin Slack](https://app.slack.com/client/T09229ZC6/C0KLZSCHF). 
In this channel, you can also get notifications about new EAP builds.

**[Install the Kotlin EAP Plugin for IDEA or Android Studio](install-eap-plugin.md)**

> By participating in the EAP, you expressly acknowledge that the EAP version may not be reliable, may not work as intended, and may contain errors.
>
> Please note that we don’t provide any guarantees of compatibility between EAP and final versions of the same release. 
>
{type="note"}

If you have already installed the EAP version and want to work on projects that were created previously, 
check [our instructions on how to configure your build to support this version](configure-build-for-eap.md). 

## Build details

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
        <th>Recommended kotlinx library versions</th>
    </tr>
    <tr>
        <td><strong>1.6.20-M1</strong>
            <p>Released: <strong>February 8, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20-M1" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
             <ul>
                <li>Language: prototype of context receivers</li>
                <li>Kotlin/JVM: experimental parallel compilation of a single module, deprecation of old <code>-Xjvm-default</code> modes, new <code>@JvmDefaultWithCompatibility</code> annotation</li>
                <li>Kotlin/Native: concurrent sweep phase in the new memory manager, support for Xcode 13 SDKs, instantiation of annotation classes, support for resolving source locations with <code>libbacktrace</code>, improved "could not build module" cinterop report, performance improvements</li>
                <li>Multiplatform: hierarchical structure support enabled by default for all new multiplatform projects</li>
                <li>CocoaPods Gradle plugin: customization of podspec properties, accepting the podspec version when configuring CocoaPods for Kotlin/Native, new tasks for generating a suitable podspec for XCFramework builds</li>
                <li>Kotlin/JS: incremental compilation in the IR backend, lazy initialization of top-level properties by default, inline <code>Char</code> class, ability to use inline classes in external types, export improvements</li>
                <li>Gradle: new flexible way of defining a Kotlin compiler execution strategy, removed <code>kotlin.parallel.tasks.in.project</code> build option, deprecated <code>kapt.use.worker.api</code> and <code>kotlin.coroutines</code> build options</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20-M1">changelog</a> or <a href="https://blog.jetbrains.com/kotlin/2022/02/kotlin-1-6-20-m1-released/">this blog post</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.2" target="_blank">1.3.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.17.0" target="_blank">0.17.0</a></li>          
                <li><a href="https://github.com/Kotlin/kotlinx-datetime" target="_blank"><strong>kotlinx-datetime</strong></a> version: <a href="https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.3.2" target="_blank">0.3.2</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/2.0.0-beta-1" target="_blank">2.0.0-beta-1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: 0.0.7</li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
</table>