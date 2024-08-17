[//]: # (title:  Kotlin releases)

Since Kotlin 2.0.0, we ship the following types of releases:

* _Language releases_ (2._x_._0_) that bring major changes in the language and include tooling updates. Released once in 6 months.
* _Tooling releases_ (2._x_._20_) that are shipped between language releases and include updates in the tooling,
    performance improvements, and bug fixes.
    Released in 3 months after corresponding _language release_.
* _Bug fix releases_ (2._x_._yz_) that include bug fixes for _tooling releases_. There is no exact release schedule for these releases.

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{type="tip"}
-->

For each language and tooling release, we also ship several preview (_EAP_) versions for you to try
new features before they are released. See [Early Access Preview](eap.md) for details.

## Update to a new release

To upgrade your project to a new release, you need to update your build script file.
For example, to update to Kotlin %kotlinVersion%, change the version of the Kotlin Gradle plugin in your
`build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "%kotlinVersion%"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "%kotlinVersion%"
    // If you target is Kotlin Multiplatform
    // kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // For example, if your target environment is JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    // If you target is Kotlin Multiplatform
    // id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

If you have projects created with earlier Kotlin versions, change the Kotlin version in your projects and update kotlinx
libraries if necessary.

If you are migrating to the new language release, Kotlin plugin's migration tools will help you with the migration.

## IDE support

Even with the release of the K2 compiler, IntelliJ IDEA and Android Studio still use the previous compiler by default 
for code analysis, code completion, highlighting, and other IDE-related features.

Starting from 2024.1, IntelliJ IDEA can use the new K2 compiler to analyze your code with its K2 mode.
To enable it, go to **Settings** | **Languages & Frameworks** | **Kotlin** and select the **Enable K2 mode** option.

> The K2 mode is in Beta from 2024.2. We are working on stability and code analysis improvements, but not all IDE features
> are supported yet.
>
{type="warning"}

After enabling K2 mode, you may notice differences in IDE analysis due to changes in compiler behavior.
Learn how the new K2 compiler differs from the previous one in the [migration guide](k2-compiler-migration-guide.md).

## Kotlin release compatibility

Learn more about [types of Kotlin releases and their compatibility](kotlin-evolution.md#language-and-tooling-releases)

## Release details

The following table lists details of the latest Kotlin releases:

> You can also use [preview versions of Kotlin](eap.md#build-details).
> 
{type="tip"}

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
    </tr>
    <tr>
        <td><strong>2.0.10</strong>
            <p>Released: <strong>August 6, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 2.0.0.</p>
            <p>Learn more about Kotlin 2.0.0 in <a href="whatsnew20.md" target="_blank">What's new in Kotlin 2.0.0</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.0</strong>
            <p>Released: <strong>May 21, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A language release with the Stable Kotlin K2 compiler.</p>
            <p>Learn more about Kotlin 2.0.0 in <a href="whatsnew20.md" target="_blank">What's new in Kotlin 2.0.0</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.25</strong>
            <p>Released: <strong>July 19, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.9.20, 1.9.21, 1.9.22, 1.9.23, and 1.9.24.</p>
            <p>Learn more about Kotlin 1.9.20 in <a href="whatsnew1920.md" target="_blank">What's new in Kotlin 1.9.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.24</strong>
            <p>Released: <strong>May 7, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.9.20, 1.9.21, 1.9.22, and 1.9.23.</p>
            <p>Learn more about Kotlin 1.9.20 in <a href="whatsnew1920.md" target="_blank">What's new in Kotlin 1.9.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.23</strong>
            <p>Released: <strong>March 7, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.9.20, 1.9.21, and 1.9.22.</p>
            <p>Learn more about Kotlin 1.9.20 in <a href="whatsnew1920.md" target="_blank">What's new in Kotlin 1.9.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.22</strong>
            <p>Released: <strong>December 21, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.9.20 and 1.9.21.</p>
            <p>Learn more about Kotlin 1.9.20 in <a href="whatsnew1920.md" target="_blank">What's new in Kotlin 1.9.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.21</strong>
            <p>Released: <strong>November 23, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.9.20.</p>
            <p>Learn more about Kotlin 1.9.20 in <a href="whatsnew1920.md" target="_blank">What's new in Kotlin 1.9.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.20</strong>
            <p>Released: <strong>November 1, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with Kotlin K2 compiler in Beta and Stable Kotlin Multiplatform.</p>
            <p>Learn more in:</p>
            <list>
                <li><a href="whatsnew1920.md" target="_blank">What's new in Kotlin 1.9.20</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.10</strong>
            <p>Released: <strong>August 23, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.9.0.</p>
            <p>Learn more about Kotlin 1.9.0 in <a href="whatsnew19.md" target="_blank">What's new in Kotlin 1.9.0</a>.</p>
            <note>For Android Studio Giraffe and Hedgehog, the Kotlin plugin 1.9.10 will be delivered with upcoming Android Studios updates.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.0</strong>
            <p>Released: <strong>July 6, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with Kotlin K2 compiler updates, new enum class values function,
                new operator for open-ended ranges, preview of Gradle configuration cache in Kotlin Multiplatform, 
                changes to Android target support in Kotlin Multiplatform, preview of custom memory allocator in Kotlin/Native.
            </p>
            <p>Learn more in:</p>
            <list>
                <li><a href="whatsnew19.md" target="_blank">What's new in Kotlin 1.9.0</a></li>
                <li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">What's new in Kotlin YouTube video</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.22</strong>
            <p>Released: <strong>June 8, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.8.20.</p>
            <p>Learn more about Kotlin 1.8.20 in <a href="whatsnew1820.md" target="_blank">What's new in Kotlin 1.8.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.21</strong>
            <p>Released: <strong>April 25, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.8.20.</p>
            <p>Learn more about Kotlin 1.8.20 in <a href="whatsnew1820.md" target="_blank">What's new in Kotlin 1.8.20</a>.</p>
            <note>For Android Studio Flamingo and Giraffe, the Kotlin plugin 1.8.21 will be delivered with upcoming Android Studios updates.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.20</strong>
            <p>Released: <strong>April 3, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with Kotlin K2 compiler updates, AutoCloseable interface and Base64 encoding in stdlib,
                new JVM incremental compilation enabled by default, new Kotlin/Wasm compiler backend.
            </p>
            <p>Learn more in:</p>
            <list>
                <li><a href="whatsnew1820.md" target="_blank">What's new in Kotlin 1.8.20</a></li>
                <li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">What's new in Kotlin YouTube video</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.10</strong>
            <p>Released: <strong>February 2, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.8.0.</p>
            <p>Learn more about <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>.</p>
            <note>For Android Studio Electric Eel and Flamingo, the Kotlin plugin 1.8.10 will be delivered with upcoming Android Studios updates.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.0</strong>
            <p>Released: <strong>December 28, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with improved kotlin-reflect performance, new recursively copy or delete directory content experimental functions for JVM, improved Objective-C/Swift interoperability.</p>
            <p>Learn more in:</p>
            <list>
                <li><a href="whatsnew18.md" target="_blank">What's new in Kotlin 1.8.0</a></li>
                <li><a href="compatibility-guide-18.md" target="_blank">Compatibility guide for Kotlin 1.8.0</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.21</strong>
            <p>Released: <strong>November 9, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.7.20.</p>
            <p>Learn more about Kotlin 1.7.20 in <a href="whatsnew1720.md" target="_blank">What's new in Kotlin 1.7.20</a>.</p>
            <note>For Android Studio Dolphin, Electric Eel, and Flamingo, the Kotlin plugin 1.7.21 will be delivered with upcoming Android Studios updates.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20</strong>
            <p>Released: <strong>September 29, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with new language features, the support for several compiler plugins in the Kotlin K2 compiler,
                the new Kotlin/Native memory manager enabled by default, and the support for Gradle 7.1.
            </p>
            <p>Learn more in:</p>
            <list>
                <li><a href="whatsnew1720.md" target="_blank">What's new in Kotlin 1.7.20</a></li>
                <li><a href="https://youtu.be/OG9npowJgE8" target="_blank">What's new in Kotlin YouTube video</a></li>
                <li><a href="compatibility-guide-1720.md" target="_blank">Compatibility guide for Kotlin 1.7.20</a></li>
            </list>
            <p>Learn more about <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.10</strong>
            <p>Released: <strong>July 7, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.7.0.</p>
            <p>Learn more about <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>.</p>
            <note>For Android Studio Dolphin (213) and Android Studio Electric Eel (221), the Kotlin plugin 1.7.10 will be delivered with upcoming Android Studios updates.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.0</strong>
            <p>Released: <strong>June 9, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with Kotlin K2 compiler in Alpha for JVM, stabilized language features, performance improvements, and evolutionary changes such as stabilizing experimental APIs.</p>
            <p>Learn more in:</p>
            <list>
                <li><a href="whatsnew17.md" target="_blank">What's new in Kotlin 1.7.0</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">What's new in Kotlin YouTube video</a></li>
                <li><a href="compatibility-guide-17.md" target="_blank">Compatibility guide for Kotlin 1.7.0</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.21</strong>
            <p>Released: <strong>April 20, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.6.20.</p>
            <p>Learn more about <a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.20</strong>
            <p>Released: <strong>April 4, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <list>
                <li>Prototype of context receivers</li>
                <li>Callable references to functional interface constructors</li>
                <li>Kotlin/Native: performance improvements for the new memory manager</li>
                <li>Multiplatform: hierarchical project structure by default</li>
                <li>Kotlin/JS: IR compiler improvements</li>
                <li>Gradle: compiler execution strategies</li>
            </list>
            <p>Learn more about <a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.10</strong>
            <p>Released: <strong>December 14, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.6.0.</p>
            <p>Learn more about <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.0</strong>
            <p>Released: <strong>November 16, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with new language features, performance improvements, and evolutionary changes such as stabilizing experimental APIs.</p>
            <p>Learn more in:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew16.md" target="_blank">What's new in Kotlin 1.6.0</a></li>
                <li><a href="compatibility-guide-16.md" target="_blank">Compatibility guide</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.32</strong>
            <p>Released: <strong>November 29, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.5.31.</p>
            <p>Learn more about <a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>.</p>
        </td>
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
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>Released: <strong>August 23, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <list>
                <li>Instantiation of annotation classes on JVM</li>
                <li>Improved opt-in requirement mechanism and type inference</li>
                <li>Kotlin/JS IR backend in Beta</li>
                <li>Support for Apple Silicon targets</li>
                <li>Improved CocoaPods support</li>
                <li>Gradle: Java toolchain support and improved daemon configuration</li>
            </list>
            <p>Learn more in:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1530.md" target="_blank">What's new in Kotlin 1.5.30</a></li>
            </list>
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
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>Released: <strong>June 24, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <list>
                <li>String concatenation via <code>invokedynamic</code> on JVM by default</li>
                <li>Improved support for Lombok and support for JSpecify</li>
                <li>Kotlin/Native: KDoc export to Objective-C headers and faster <code>Array.copyInto()</code> inside one array</li>
                <li>Gradle: caching of annotation processors' classloaders and support for the <code>--parallel</code> Gradle property</li>
                <li>Aligned behavior of stdlib functions across platforms</li>
            </list>
            <p>Learn more in:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1520.md" target="_blank">What's new in Kotlin 1.5.20</a></li>
            </list>
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
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>Released: <strong>May 5, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with new language features, performance improvements, and evolutionary changes such as stabilizing experimental APIs.</p>
            <p>Learn more in:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew15.md" target="_blank">What's new in Kotlin 1.5.0</a></li>
                <li><a href="compatibility-guide-15.md" target="_blank">Compatibility guide</a></li>
            </list>
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
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>Released: <strong>February 3, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <list>
                <li>New JVM backend, now in Beta</li>
                <li>Preview of new language features</li>
                <li>Improved Kotlin/Native performance</li>
                <li>Standard library API improvements</li>
            </list>
            <p>Learn more in:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1430.md" target="_blank">What's new in Kotlin 1.4.30</a></li>
            </list>
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
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>Released: <strong>November 23, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>An incremental release with various improvements such as:</p>
            <list>
                <li>Supporting new JVM features, like string concatenation via <code>invokedynamic</code></li>
                <li>Improved performance and exception handling for Kotlin Multiplatform Mobile projects</li>
                <li>Extensions for JDK Path: <code>Path("dir") / "file.txt"</code></li>
            </list>
            <p>Learn more in:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew1420.md" target="_blank">What's new in Kotlin 1.4.20</a></li>
            </list>
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
    </tr>
    <tr>
        <td><strong>1.4.0</strong>
            <p> Released: <strong>August 17, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with many features and improvements that mostly focus on quality and performance.</p>
            <p>Learn more in:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Release blog post</a></li>
                <li><a href="whatsnew14.md" target="_blank">What's new in Kotlin 1.4.0</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">Compatibility guide</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">Migrating to Kotlin 1.4.0</a></li>
            </list>
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
    </tr>
</table>
