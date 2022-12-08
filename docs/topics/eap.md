[//]: # (title: Participate in the Kotlin Early Access Preview)

You can participate in the Kotlin Early Access Preview (EAP) to try out the latest Kotlin features before they are released.

We ship a few Beta (_Beta_) and Release Candidate (_RC_) builds before every feature (_1.x_) and incremental (_1.x.y_) release. 

We'll be very thankful if you find and report bugs to our issue tracker [YouTrack](https://kotl.in/issue). 
It is very likely that we'll be able to fix them before the final release, which means you won't need to wait until the next Kotlin release for your issues to be addressed. 

By participating in the Early Access Preview and reporting bugs, you contribute to Kotlin and help us make it better 
for everyone in [the growing Kotlin community](https://kotlinlang.org/community/). We appreciate your help a lot! 

If you have any questions and want to participate in discussions, you are welcome to join the [#eap channel in Kotlin Slack](https://app.slack.com/client/T09229ZC6/C0KLZSCHF). 
In this channel, you can also get notifications about new EAP builds.

**[Install the Kotlin EAP Plugin for IDEA or Android Studio](install-eap-plugin.md)**

> By participating in the EAP, you expressly acknowledge that the EAP version may not be reliable, may not work as intended, and may contain errors.
>
> Please note that we don't provide any guarantees of compatibility between EAP and final versions of the same release. 
>
{type="note"}

If you have already installed the EAP version and want to work on projects that were created previously, 
check [our instructions on how to configure your build to support this version](configure-build-for-eap.md). 

## How the EAP can help you be more productive with Kotlin

* **Prepare for the Stable release**. If you work on a complex multi-module project, participating in the EAP may streamline your experience when you adopt the Stable release version. The sooner you update to the Stable version, the sooner you can take advantage of its performance improvements and new language features. 

  The migration of huge and complex projects might take a while, not only because of their size but also because some specific use cases may not have been covered by the Kotlin team yet. By participating in the EAP and continuously testing new versions of Kotlin, you can provide us with early feedback about your specific use cases. This will help us address as many issues as possible and ensure you can safely update to the Stable version when it's released. [Check out how Slack benefits from testing Android, Kotlin, and Gradle pre-release versions](https://slack.engineering/shadow-jobs/).
* **Keep your library up-to-date**. If you're a library author, updating to the new Kotlin version is extremely important. Using older versions could block your users from updating Kotlin in their projects. Working with EAP versions allows you to support the latest Kotlin versions in your library almost immediately with the Stable release, which makes your users happier and your library more popular.
* **Share the experience**. If you're a Kotlin enthusiast and enjoy contributing to the Kotlin ecosystem by creating educational content, trying new features in the Kotin EAP allows you to be among the first to share the experience of using the new cool features with the community.

## Build details

<!-- _No preview versions are currently available._ -->

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
    </tr>
    <tr>
        <td><strong>1.8.0-RC</strong>
            <p>Released: <strong>December 8, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0-RC" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
             <ul>
                 <li>Kotlin/JVM: removed the old backend, added support for Java 19 bytecode</li>
                 <li>Kotlin/Native: support for Xcode 14 and <code>watchosDeviceArm64</code> target, new <code>@ObjCName</code>, <code>@HiddenFromObjC</code> and <code>@ShouldRefineInSwift</code> annotations to improve Objective-C and Swift interoperability</li>
                 <li>Kotlin Multiplatform: new Android source set layout that can be enabled in Gradle plugin with <code>kotlin.mpp.androidSourceSetLayoutVersion=2</code> and includes new naming schema for <code>KotlinSourceSet</code> entities</li>
                 <li>Kotlin/JS: stable IR compiler that uses incremental compilation by default, deprecated old backend</li>
                 <li>Compiler: Lombok compiler plugin supports the <code>@Builder</code> annotation</li>
                 <li>Gradle: ensured compatibility with Gradle 7.3, disabled daemon fallback strategy with <code>kotlin.daemon.useFallbackStrategy</code>, exposed available Kotlin compiler options as Gradle lazy properties, minimum supported Gradle version is 6.8.3, minimum supported Android Gradle plugin version is 4.1.3</li>
                 <li>Libraries: stable extensions for <code>java.util.Optional</code> in stdlib, stable <code>toTimeUnit()</code>, <code>toDurationUnit</code>, <code>cbrt()</code> functions, JVM target is 1.8 for stdlib, experimental enhancement of <code>TimeMark</code> allowing <code>elapsedNow</code> to be read from multiple <code>TimeMark</code>s simultaneously, added extension functions to <code>java.nio.file.Path</code> that can recursively copy or delete directories</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0-RC">changelog</a> or <a href="whatsnew-eap.md">What's new in Kotlin 1.8.0-RC</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.0-Beta</strong>
            <p>Released: <strong>November 15, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0-Beta" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
             <ul>
                 <li>Kotlin/JVM: removed the old backend, added support for Java 19 bytecode</li>
                 <li>Kotlin/Native: support for Xcode 14.1 and <code>watchosDeviceArm64</code> target, new <code>@ObjCName</code>, <code>@HiddenFromObjC</code> and <code>@ShouldRefineInSwift</code> annotations to improve Objective-C and Swift interoperability</li>
                 <li>Kotlin Multiplatform: new Android source set layout that can be enabled in Gradle plugin with <code>kotlin.mpp.androidSourceSetLayoutVersion=2</code> and includes new naming schema for <code>KotlinSourceSet</code> entities</li>
                 <li>Kotlin/JS: stable IR compiler that uses incremental compilation by default, deprecated old backend</li>
                 <li>Compiler: Lombok compiler plugin supports the <code>@Builder</code> annotation</li>
                 <li>Gradle: ensured compatibility with Gradle 7.3, disabled daemon fallback strategy with <code>kotlin.daemon.useFallbackStrategy</code>, exposed available Kotlin compiler options as Gradle lazy properties, minimum supported Gradle version is 6.8.3, minimum supported Android Gradle plugin version is 4.1.3</li>
                 <li>Libraries: stable extensions for <code>java.util.Optional</code> in stdlib, stable <code>toTimeUnit()</code>, <code>toDurationUnit</code>, <code>cbrt()</code> functions, JVM target is 1.8 for stdlib, experimental enhancement of <code>TimeMark</code> allowing <code>elapsedNow</code> to be read from multiple <code>TimeMark</code>s simultaneously, added extension functions to <code>java.nio.file.Path</code> that can recursively copy or delete directories</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0-Beta">changelog</a> or <a href="whatsnew-eap.md">What's new in Kotlin 1.8.0-Beta</a>.</p>
        </td>
    </tr>
</table>