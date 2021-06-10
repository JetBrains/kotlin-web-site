[//]: # (title: Participate in the Kotlin Early Access Preview)

You can participate in the Kotlin Early Access Preview (EAP) to try out the latest Kotlin features before they are released.

We ship a few Milestone (_M_) builds before every feature (_1.x_) and incremental (_1.x.y_) release. 

We’ll be very thankful if you find and report bugs to our issue tracker [YouTrack](https://kotl.in/issue). 
It is very likely that we’ll be able to fix them before the final release, which means you won’t need to wait until the next Kotlin release for your issues to be addressed. 

By participating in the Early Access Preview and reporting bugs, you contribute to Kotlin and help us make it better 
for everyone in [the growing Kotlin community](https://kotlinlang.org/community/). We appreciate your help a lot! 

If you have any questions and want to participate in discussions, you are welcome to join the _#eap_ channel in [Kotlin Slack](https://app.slack.com/client/T09229ZC6/C0KLZSCHF). 
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
        <td><strong>1.5.20-RC</strong>
            <p>Released: <strong>June 10, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20-RC" target="_blank">Release on GitHub</a></p>
        </td>
        <td> 
             <ul>
                <li>Parallel compilation of Kotlin sources is controlled by <code>--parallel</code> Gradle property. The <code>kotlin.parallel.tasks.in.project</code> property is deprecated.</li>
                <li>Aligned behavior of stdlib functions <code>isLowerCase</code>/<code>isUpperCase</code> and <code>digitToInt</code> across platforms.</li>
                <li>Kotlin/Native: opt-in export of KDoc comments to the generated Objective-C headers with the <code>-Xexport-kdoc</code> compiler option.</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20-RC">changelog</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.4" target="_blank">1.5.4</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20-M1</strong>
            <p>Released: <strong>May 26, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20-M1" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
             <ul>
                <li>String concatenation uses invokedynamic on JVM by default.</li>
                <li>Annotations on function type parameters are emitted to the bytecode on JVM 1.8+.</li>
                <li>Kotlin/Native: improved performance of <code>Array.copyInto</code> inside one array.</li>
                <li>Experimental caching of annotation processors' classloaders.</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20-M1">changelog</a>.</p>        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.4" target="_blank">1.5.4</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
</table>
