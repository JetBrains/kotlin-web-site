
While it is certainly possible to use the command line, be it directly or
combine it with a script file (i.e. bash or bat file), we should notice,
that it does not scale well for bigger projects with hundreds of files and libraries.
It is more recommendable to use the Kotlin/Native compiler is with a build system which
helps by downloading and caching the Kotlin/Native compiler binaries and libraries with
transitive dependencies, and it runs the compiler and tests.
Kotlin/Native uses the [Gradle](https://gradle.org) build system through the
[kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html) plugin.

We cover the basics of an IDE compatible project setup with Gradle in the
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#create-gradle-project)
tutorial. Please check that out to see the detailed first steps
and instructions to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial we'll see advanced C interop related usages of the Kotlin/Native 
and
[multiplatform](/docs/reference/building-mpp-with-gradle.html)
builds with Gradle.

Let's first create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before new files are added.

We'll use the following 
<span class="multi-language-span" data-lang="groovy">
`build.gradle` 
</span>
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span>
Gradle build file with the following contents:
[[include pages-includes/docs/tutorials/native/mapping-primitive-data-types-from-c-code.md]]

You may also download the project skeleton directly from 
[[include pages-includes/docs/tutorials/native/mapping-primitive-data-types-from-c-link.md]]


The project file configures C interop as an additional step of the build.
Let's move the `interop.def` file under the `src/nativeInterop/cinterop` directory.
Gradle recommends using conventions instead of configurations,
for example, the sources path it `src/nativeMain/kotlin` and the 
`.def` file is expected in `src/nativeInterop/cinterop/interop.def`.
By default, all symbols from C are imported to the `interop` package,
we may want to import the whole package in our `.kt` files.
Check out the [kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html)
plugin documentation to learn the ways to configure it.
