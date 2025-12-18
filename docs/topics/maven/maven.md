[//]: # (title: Maven)

Maven is a build system that helps manage Kotlin-only or mixed Kotlin−Java projects and automate your building process.
It works with JVM-based projects and downloads required dependencies, compiles and packages your code.
Learn more about its basics and specifics on the [Maven](https://maven.apache.org/) website.

Here's a general workflow when working with a Kotlin Maven project:

1. [Apply the Kotlin Maven plugin](maven-configure-project.md#enable-and-configure-the-plugin).
2. [Declare repositories](maven-configure-project.md#declare-repositories).
3. [Set project dependencies](maven-configure-project.md#set-dependencies).
4. [Configure source code compilation](maven-compile-package.md#configure-source-code-compilation).
5. [Configure the Kotlin compiler](maven-compile-package.md#configure-kotlin-compiler).
6. [Package your application](maven-compile-package.md#package-your-project).

To get started, you can also follow our step-by-step tutorials:

* [Configure a Java project to work with Kotlin](mixing-java-kotlin-intellij.md)
* [Test your Java Maven project with Kotlin and JUnit5](jvm-test-using-junit.md)

> You can check out our public [sample project](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)
> with both Maven and Gradle build files already set up for a mixed Kotlin/Java project.
>
{style="tip"}

## What's next?

* **Improve your debugging experience** with the [`power-assert` plugin](power-assert.md#maven).
* **Measure test coverage and generate reports** with the [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/).
* **Configure annotation processing** with the [`kapt` plugin](kapt.md#use-in-maven).
* **Generate documentation** with the [Dokka documentation engine](dokka-maven.md).
  It supports mixed-language projects and can generate output in multiple formats, including standard Javadoc.
* **Enable OSGi support** by adding the [`kotlin-osgi-bundle`](kotlin-osgi.md#maven).