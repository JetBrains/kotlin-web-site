---
type: tutorial
layout: tutorial
title:  "A Basic Kotlin/Native Application"
description: "A look at how to compile our first Kotlin/Native application and open it in an IDE"
authors: Hadi Hariri
date: 2020-01-15
---

<!--- To become a How-To. Need to change type to new "HowTo" --->



<a name="open-in-ide"></a>
## Opening the Project in IDE

We are using [IntelliJ IDEA](https://jetbrains.com/idea) for this tutorial.
Both the [free and open source](https://www.jetbrains.com/idea/features/editions_comparison_matrix.html)
IntelliJ IDEA [Community Edition](https://www.jetbrains.com/idea/download) and
IntelliJ IDEA Ultimate Edition work for this tutorial. 
We can download and install both of them from [https://jetbrains.com/idea/download](https://jetbrains.com/idea/download) if necessary.
The Kotlin plugin is included with IntelliJ IDEA by default, but still, we need to make sure the Kotlin plugin version
is {{ site.data.releases.latest.version }} (or newer) in the _Settings_ or _Preferences_ dialog, under
the Language & Frameworks | Kotlin section.


At this point, we should have a Gradle project that is ready to be opened in an IDE.
IntelliJ IDEA (CLion, AppCode, or AndroidStudio) helps us to generate the
[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
scripts for our project. 

Now let's open the project in IntelliJ IDEA. For that we click on the File | Open... and select
our 
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`build.gradle`
</span>
project file. 

![Open Project Dialog]({{ url_for('tutorial_img', filename='native/basic-kotlin-native/idea-open-as-project.png')}}){: width="70%"}

Confirm to open the file _as Project_.

![Gradle Import Dialog]({{ url_for('tutorial_img', filename='native/basic-kotlin-native/idea-import-gradle.png')}})

Select _Use gradle 'wrapper' task configuration_ option in the Gradle import dialog to complete the import.
For existing projects, which already have Gradle wrapper scripts, the _Use default Gradle wrapper_
option should be selected instead.

Use the path to the Java runtime version 1.8 or 11 for the _Gradle JVM_ field. Check out the 
[https://jdk.java.net/11](https://jdk.java.net/11/) or [https://adoptopenjdk.net/](https://adoptopenjdk.net/)
for the best JRE, OpenJDK, or JDK distribution.  

<a name="run-in-ide"></a>
## Running the application

Usually, a native binary can be compiled as _debug_ with more debug information and fewer optimizations, and _release_
where optimizations are enabled and there is no (or at least less) debug information available.  
The binary files are created in the `build/bin/native/debugExecutable` or `build/bin/native/releaseExecutable`
folders respectively. The file has a `.kexe` extension on Linux and macOS and an `.exe` extension on Windows. Use the following command
to instruct the build to produce binaries:

<div class="multi-language-sample" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew build
```
</div>
</div>

<div class="multi-language-sample" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew build
```
</div>
</div>

<div class="multi-language-sample" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
gradlew.bat build
```
</div>
</div>

It's important to understand that this is now a native application, and no
runtime or virtual machine is required.
We can now run the compiled binary from the console:

```
Hello Kotlin/Native!
```

In addition to the build tasks, the Gradle build includes helpful
tasks to run the application directly via
`runDebugExecutableNative` and `runReleaseExecutableNative`.

The names of these tasks were created from the formula:
`run[Debug|Release]Executable<target name>`,
where `target name` is the capitalized target name that we specified in the
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`build.gradle`
</span>
file out of our build, `"native"` in our case.
Let's run the task in the IDE. For that, let's open the Gradle Tool Window
and find the task in the list: 
![Gradle Import Dialog]({{ url_for('tutorial_img', filename='native/basic-kotlin-native/idea-run-gradle-task.png')}})

Alternatively, we may call the following command from the console:
[[include pages-includes/docs/tutorials/native/runDebugExecutableNative.md]]

The output should be:

```
> Task :runDebugExecutableNative
Hello Kotlin/Native!

BUILD SUCCESSFUL
```

## Next Steps

Kotlin/Native can be used for many 
[targets](targeting-multiple-platforms.html) and applications,
including, but not limited to
macOS, Windows, Linux, and [iOS](/docs/tutorials/native/mpp-ios-android.html).

Calling C, Objective-C, or Swift from Kotlin/Native is easy. Take a look at
the [C Interop documentation](/docs/reference/native/c_interop.html) or
[Objective-C and Swift](/docs/reference/native/objc_interop.html) interop
documentation or check out one of our tutorials.

With Kotlin [multiplatform](/docs/reference/multiplatform.html) projects, it is possible to
share the same Kotlin code between all the supported platforms. 
Check out the tutorial on [sharing Kotlin code between iOS and Android](/docs/tutorials/native/mpp-ios-android.html)
or have a look at how to build your own [multiplatform library](/docs/tutorials/mpp/multiplatform-library.html).


