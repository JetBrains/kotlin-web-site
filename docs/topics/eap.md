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

* **Prepare for the Stable release**. If you work on a complex multimodule project, participating in the EAP may streamline your experience when you adopt the Stable release version. The sooner you update to the Stable version, the sooner you can take advantage of its performance improvements and new language features. 

  The migration of huge and complex projects might take a while, not only because of their size, but also because some specific use cases may not have been covered by the Kotlin team yet. By participating in the EAP and continuously testing new versions of Kotlin, you can provide us with early feedback about your specific use cases. This will help us address as many issues as possible and ensure you can safely update to the Stable version when it's released. [Check out how Slack benefits from testing Android, Kotlin, and Gradle pre-release versions](https://slack.engineering/shadow-jobs/).
* **Keep your library up-to-date**. If you're a library author, updating to the new Kotlin version is extremely important. Using older versions could block your users from updating Kotlin in their projects. Working with EAP versions allows you to support the latest Kotlin versions in your library almost immediately with the Stable release, which makes your users happier and your library more popular.
* **Share the experience**. If you're a Kotlin enthusiast and enjoy contributing to the Kotlin ecosystem by creating educational content, trying new features in the Kotlin EAP allows you to be among the first to share the experience of using the new cool features with the community.

## Build details

 _No preview versions are currently available._ 

<!--
<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
    </tr>
    <tr>
        <td><strong>1.9.0-RC</strong>
            <p>Released: <strong>June 20, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0-RC" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
             <ul>
                 <li>Language: Stable <code>rangeUntil</code> operator, data objects, <code>Enum.entries</code> replacement for <code>Enum.values()</code>, and the <code>@Volatile</code> annotation</li>
                 <li>K2: basic support for Kotlin/Native and multiplatform projects, support for Kotlin/JS since 1.8.20</li>
                 <li>Kotlin/JVM: <code>@JvmDefault</code> and old <code>-Xjvm-default</code> modes deprecated with error, support for Java 20 bytecode</li>
                 <li>Kotlin/Native: new custom memory allocator, no object initialization when accessing <code>const val</code>, partial linkage enabled by default</li>
                 <li>Kotlin Multiplatform: new name for the <code>android</code> block, new Android source set layout enabled by default, support for Gradle configuration caching in multiplatform libraries, ability to disable sources publication in the Kotlin Multiplatform Gradle plugin, ability to add dependencies between Pods when using the CocoaPods Gradle plugin</li>
                 <li>Kotlin/Wasm: runtime footprint reduced and performance improved, set system default browser as default for <code>wasmBrowserRun</code> task, improved JS interop, more compiler and IDE diagnostics for JS interop</li>
                 <li>Kotlin/JS: deprecated legacy backend with error, deprecated external Enum class, extracted DOM API from standard library to module automatically added to builds, partial linkage enabled by default, IR compiler used by default, changed default destination of production distributions, deprecated <code>kotlin-js</code> Gradle plugin that is replaced by <code>kotlin-multiplatform</code> Gradle plugin, experimental support for ES6 classes and modules, reduced memory consumption for production builds</li>
                 <li>Libraries: Stable standard library functions for open-ended ranges, new common function to get regex capture group by name, new <code>HexFormat</code> to format and parse hexadecimals, Stable time API, new path utility to create parent directories, reviewed and stabilized Kotlin/Native standard library</li>
                 <li>Gradle: build scans show whether K1 or K2 compiler is used, new Gradle property <code>kotlin.experimental.tryK2</code> to try the K2 compiler, new project-level compiler options for Kotlin/JVM plugin, removed <code>KotlinCompile</code> task's <code>classpath</code> property, exposed <code>jvmTargetValidationMode</code> property in <code>KotlinCompile</code> task, configurable standalone mode for Kotlin/Native iOS simulator tests, removed support for <code>org.gradle.api.internal.HasConvention</code> Gradle element, added <code>optIn</code> and <code>progressiveMode</code> compiler options, compiler plugins are published separately and Gradle plugins add them as compiler arguments, kapt tasks don’t trigger eager task creation, minimum supported Android Gradle plugin version is 4.2.2</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0-RC">changelog</a> or <a href="whatsnew-eap.md">What's new in Kotlin 1.9.0-RC</a>.</p>
        </td>
    </tr>
</table>

> If the Kotlin EAP plugin can't find the latest EAP build, check that you are using the latest version of [IntelliJ IDEA](https://www.jetbrains.com/help/idea/update.html) or [Android Studio](https://developer.android.com/studio/intro/update).
>
{type="note"}

-->