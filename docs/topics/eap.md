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

## Build details

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
    </tr>
    <tr>
        <td><strong>1.7.20-RC</strong>
            <p>Released: <strong>%kotlinEapReleaseDate%</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-RC" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
             <ul>
                 <li>K2 compiler: support for the <code>all-open</code>, <code>no-arg</code>, SAM-with-receiver, Lombok, Parcelize, AtomicFU, and <code>jvm-abi-gen</code> compiler plugins</li>
                 <li>Language: experimental <code>..&lt;</code> (<code>rangeUntil</code>) operator for ranges with the excluded end bound, deprecated inferring type variables into an empty intersection type, warning on potentially empty intersection types, improved script handling in source roots</li>
                 <li>Kotlin/JVM: experimental generic inline classes, more optimized cases of delegated properties</li>
                 <li>Kotlin/Native: the new memory manager enabled by default (with deprecated freezing API and an ability to run Kotlin <code>suspend</code> functions on non-main threads from Swift), customizable bundle identifier of the generated framework, improved documentation generated to the Objective-C header</li>
                 <li>Kotlin/JS IR: improved speed on the first build when using the incremental compilation, faster klib generation</li>
                 <li>Gradle: simplified configuration method for the JVM Toolchain, fixed deprecations and ensured compatibility with Gradle 7.1</li>
            </ul>
            <p>For more details, please refer to the <a href ="whatsnew-eap.md">What's new in EAP</a> or <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-RC">changelog</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20-Beta</strong>
            <p>Released: <strong>August 1, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-Beta" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
             <ul>
                 <li>K2 compiler: support for the <code>all-open</code>, <code>no-arg</code>, Parcelize, AtomicFU, and <code>jvm-abi-gen</code> compiler plugins</li>
                 <li>Language: experimental <code>..&lt;</code> (<code>rangeUntil</code>) operator for ranges with the excluded end bound, deprecated inferring type variables into an empty intersection type, warning on potentially empty intersection types, improved script handling in source roots</li>
                 <li>Kotlin/JVM: experimental generic inline classes, more optimized cases of delegated properties</li>
                 <li>Kotlin/Native: the new memory manager enabled by default (with deprecated freezing API and an ability to run Kotlin <code>suspend</code> functions on non-main threads from Swift), customizable bundle identifier of the generated framework, improved documentation generated to the Objective-C header</li>
                 <li>Kotlin/JS IR: improved speed on the first build when using the incremental compilation, faster klib generation</li>
                 <li>Gradle: simplified configuration method for the JVM Toolchain, fixed deprecations and ensured compatibility with Gradle 7.1</li>
            </ul>
            <p>For more details, please refer to the <a href ="whatsnew-eap.md">What's new in EAP</a> or <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-Beta">changelog</a>.</p>
        </td>
    </tr>
</table>