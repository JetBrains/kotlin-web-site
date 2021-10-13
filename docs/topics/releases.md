[//]: # (title:  Kotlin releases)

We ship different types of releases:

* _Feature releases_ (1._x_) that bring major changes in the language.
* _Incremental releases_ (1._x_._y_) that are shipped between feature releases and include updates in the tooling, 
performance improvements, and bug fixes.
* _Bug fix releases_ (1._x_._yz_) that include bug fixes for incremental releases.

For example, for the feature release 1.3 we had several incremental releases including 1.3.10, 1.3.20, and 1.3.70.
For 1.3.70, we had 2 bug fix releases – 1.3.71 and 1.3.72.

For each incremental and feature release, we also ship several preview (_EAP_) versions for you to try 
new features before they are released. See [Early Access Preview](eap.md) for details.

Learn more about [types of Kotlin releases and their compatiblity](kotlin-evolution.md#feature-releases-and-incremental-releases). 

## Update to a new release

IntelliJ IDEA and Android Studio suggest updating to a new release once it is out. When you accept the suggestion,
it automatically updates the Kotlin plugin to the new version. You can check the Kotlin version in **Tools** \| **Kotlin** 
\| **Configure Kotlin Plugin Updates**.

If you have projects created with earlier Kotlin versions, change the Kotlin version in your projects and update kotlinx
libraries if necessary – check the [recommended versions](#release-details).

If you are migrating to the new feature release, Kotlin plugin's migration tools will help you with the migration.

## IDE support

The IDE support for the latest version of the language is available for the following versions of IntelliJ IDEA and Android Studio:
* IntelliJ IDEA:
  * Latest stable ([IntelliJ IDEA %kotlinPluginVersion%](https://www.jetbrains.com/idea/whatsnew/) version)
  * Previous stable ([IntelliJ IDEA %kotlinPreviousPluginVersion%](https://blog.jetbrains.com/idea/2020/12/intellij-idea-2020-3/) version)
  * [Early access](https://www.jetbrains.com/resources/eap/) versions
* Android Studio:
  * [Latest released](https://developer.android.com/studio) version
  * [Early access](https://developer.android.com/studio/preview) versions

## Release details

The following table lists details of latest Kotlin releases.

You can also use [preview versions of Kotlin](eap.md#build-details).

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
        <th>Recommended kotlinx library versions</th>
    </tr>
    <tr>
        <td><strong>1.5.31</strong>
            <p>Released: <strong>September 20, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.5.30.</p>
            <p>Learn more about <a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC" target="_blank">1.3.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.2" target="_blank">1.5.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.3" target="_blank">0.16.3</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.3" target="_blank">1.6.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>Released: <strong>August 23, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <ul>
                <li>Instantiation of annotation classes on JVM</li>
                <li>Improved opt-in requirement mechanism and type inference</li>
                <li>Kotlin/JS IR backend in Beta</li>
                <li>Support for Apple Silicon targets</li>
                <li>Improved CocoaPods support</li>
                <li>Gradle: Java toolchain support and improved daemon configuration</li>
            </ul>
            <p>Learn more in:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1530.md" target="_blank">What's new in Kotlin 1.5.30</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC" target="_blank">1.3.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.1" target="_blank">1.5.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.2" target="_blank">0.16.2</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.2" target="_blank">1.6.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.21</strong>
            <p>Released: <strong>July 13, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.5.20.</p>
            <p>Learn more about <a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>Released: <strong>June 24, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <ul>
                <li>String concatenation via <code>invokedynamic</code> on JVM by default</li>
                <li>Improved support for Lombok and support for JSpecify</li>
                <li>Kotlin/Native: KDoc export to Objective-C headers and faster <code>Array.copyInto()</code> inside one array</li>
                <li>Gradle: caching of annotation processors' classloaders and support for the <code>--parallel</code> Gradle property</li>
                <li>Aligned behavior of stdlib functions across platforms</li>
            </ul>
            <p>Learn more in:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1520.md" target="_blank">What's new in Kotlin 1.5.20</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.10</strong>
            <p>Released: <strong>May 24, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.5.0.</p>
            <p>Learn more about <a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.4" target="_blank">1.5.4</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>Released: <strong>May 5, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with new language features, performance improvements, and evolutionary changes such as stabilizing experimental APIs.</p>
            <p>Learn more in:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew15.md" target="_blank">What's new in Kotlin 1.5.0</a></li>
                <li><a href="compatibility-guide-15.md" target="_blank">Compatibility Guide</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC" target="_blank">1.5.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.3" target="_blank">1.5.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.32</strong>
            <p>Released: <strong>March 22, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.32" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.4.30.</p>
            <p>Learn more about <a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0" target="_blank">1.1.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.3" target="_blank">1.4.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.15.2" target="_blank">0.15.2</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.2" target="_blank">1.5.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.31</strong>
            <p>Released: <strong>February 25, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.4.30</p>
            <p>Learn more about <a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0" target="_blank">1.1.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.2" target="_blank">1.4.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.15.1" target="_blank">0.15.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.1" target="_blank">1.5.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>Released: <strong>February 3, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <ul>
                <li>New JVM backend, now in Beta</li>
                <li>Preview of new language features</li>
                <li>Improved Kotlin/Native performance</li>
                <li>Standard library API improvements</li>
            </ul>
            <p>Learn more in:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1430.md" target="_blank">What's new in Kotlin 1.4.30</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC" target="_blank">1.1.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.2" target="_blank">1.4.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.15.1" target="_blank">0.15.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.1" target="_blank">1.5.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>Released: <strong>December 7, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.4.20</p>
            <p>Learn more about <a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.1" target="_blank">1.0.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>Released: <strong>November 23, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <ul>
                <li>Supporting new JVM features, like string concatenation via <code>invokedynamic</code></li>
                <li>Improved performance and exception handling for KMM projects</li>
                <li>Extensions for JDK Path: <code>Path(“dir”) / “file.txt”</code></li>
            </ul>
            <p>Learn more in:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1420.md" target="_blank">What's new in Kotlin 1.4.20</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.1" target="_blank">1.0.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
       </tr>
    <tr>
        <td><strong>1.4.10</strong>
            <p>Released: <strong>September 7, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.4.0.</p>
            <p>Learn more about <a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>.</p>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.0</strong>
            <p> Released: <strong>August 17, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with many features and improvements that mostly focus on quality and performance.</p>
            <p>Learn more in:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew14.md" target="_blank">What's new in Kotlin 1.4.0</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">Compatibility Guide</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">Migrating to Kotlin 1.4.0</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization
                </a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a>
                version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a>
                version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.3.72</strong>
            <p> Released: <strong>April 15, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.3.70.</p>
            <p>Learn more about <a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization
                </a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/blob/master/CHANGELOG.md#0200--2020-03-04" target="_blank">0.20.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a>
                version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.8" target="_blank">1.3.8
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a>
                version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.2" target="_blank">0.14.2
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank">ktor</a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.3.2" target="_blank">1.3.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.1" target="_blank">0.7.1</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.3" target="_blank">0.0.3</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>
</table>

> On the JVM, you usually can use library versions other than the recommended ones.
>
{type="note"}
