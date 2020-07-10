
While it is possible to use the command line, either directly or
by combining it with a script file (i.e., sh or bat file), we should notice,
that it does not scale well for big projects that have hundreds of files and libraries.
It is then better to use the Kotlin/Native compiler with a build system, as it
helps to download and cache the Kotlin/Native compiler binaries and libraries with
transitive dependencies and run the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the
[kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html) plugin.

We covered the basics of setting up an IDE compatible project with Gradle in the
[A Basic Kotlin/Native Application](/docs/tutorials/native/using-gradle.html)
tutorial. Please check it out if you are looking for detailed first steps
and instructions on how to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial, we'll look at the advanced C interop related usages of Kotlin/Native 
and
[multiplatform](/docs/reference/building-mpp-with-gradle.html)
builds with Gradle.

First, let's create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before any new files can be added.

We'll use the following 
<span class="multi-language-span" data-lang="groovy">
`build.gradle` 
</span>
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span>
Gradle build file with the following contents: