[//]: # (title: Tips for improving Kotlin/Native compilation times)


The Kotlin/Native compiler is constantly receiving updates that improve its performance. With the latest Kotlin/Native
compiler and a properly configured build environment, you can significantly improve the compilation times of your projects
with Kotlin/Native targets.

Read on for our tips on how to speed up the Kotlin/Native compilation process.

## General recommendations

* **Use the most recent version of Kotlin**. This way you will always have the latest performance improvements.
* **Avoid creating huge classes**. They take a long time to compile and load during execution.
* **Preserve downloaded and cached components between builds**. When compiling projects, Kotlin/Native downloads the required components
  and caches some results of its work to the `$USER_HOME/.konan` directory. The compiler uses this directory for subsequent
  compilations, making them take less time to complete.

  When building in containers (such as Docker) or with continuous integration systems, the compiler may have to create
  the `~/.konan` directory from scratch for each build. To avoid this step, configure your environment to preserve `~/.konan`
  between builds. For example, redefine its location using the `KONAN_DATA_DIR` environment variable.

## Gradle configuration

The first compilation with Gradle usually takes more time than subsequent ones due to the need to download the dependencies,
build caches, and perform additional steps. You should build your project at least twice to get an accurate reading of
the actual compilation times.

Here are some recommendations for configuring Gradle for better compilation performance:

* **Increase the [Gradle heap size](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)**.
  Add `org.gradle.jvmargs=-Xmx3g` to `gradle.properties`. If you use [parallel builds](https://docs.gradle.org/current/userguide/performance.html#parallel_execution),
  you might need to make the heap even larger or choose the right number of threads with `org.gradle.parallel.threads`.

* **Build only the binaries you need**. Don't run Gradle tasks that build the whole project, such as `build` or `assemble`,
  unless you really need to. These tasks build the same code more than once, increasing the compilation times. In typical
  cases such as running tests from IntelliJ IDEA or starting the app from Xcode, the Kotlin tooling avoids executing unnecessary
  tasks. 
  
  If you have a non-typical case or build configuration, you might need to choose the task yourself.
    * `linkDebug*`: To run your code during development, you usually need only one binary, so running the corresponding
      `linkDebug*` task should be enough. Keep in mind that compiling a release binary (`linkRelease*`) takes more time
      than compiling a debug one.
    * `packForXcode`: Since iOS simulators and devices have different processor architectures, it's a common approach to
      distribute a Kotlin/Native binary as a universal (fat) framework. During local development, it will be faster to build
      the `.framework` for only the platform you’re using.
      
      To build a platform-specific framework, call the  `packForXcode` task generated
      by the [KMM project wizard](kmm-create-first-app.md). 
      
      > Remember that in this case, you will need to clean the build using `./gradlew clean` after switching between the
      > device and the simulator. See [this issue](https://youtrack.jetbrains.com/issue/KT-40907) for details.
      > 
      {type="note"}


* **Don’t disable the [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)** without having a
  good reason to. [Kotlin/Native runs from the Gradle daemon](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)
  by default. When it’s enabled, the same JVM process is used and there is no need to warm it up for each compilation.

* **Use the Gradle [build caches](https://docs.gradle.org/current/userguide/build_cache.html)**:
    * **Local build cache**: Add `org.gradle.caching=true` to your `gradle.properties` or run with `--build-cache` on the command line.
    * **Remote build cache** in continuous integration environments. Learn how to [configure the remote build cache](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote).

* **Use the compiler caches**. Starting from 1.5.0-M1, `linuxX64` and `iosArm64` targets have experimental opt-in support
  for compiler caches. They improve compilation times for debug builds (for `linuxX64`, this feature is only available on Linux hosts).
  To enable the compiler caches, add `kotlin.native.cacheKind.linuxX64=static` or `kotlin.native.cacheKind.iosArm64=static` to `gradle.properties`.

  The following targets already have the compiler caches enabled by default:
  * `iosX64`
  * `iosSimulatorArm64`
  * `macosX64`
  * `macosArm64`

* **Enable previously disabled features of Kotlin/Native**. There are properties that disable the Gradle daemon and compiler
  caches – `kotlin.native.disableCompilerDaemon=true` and `kotlin.native.cacheKind=none`. If you had issues with these
  features before and added these lines to your `gradle.properties` or Gradle arguments, remove them and check whether
  the build completes successfully. It is possible that these properties were added previously to work around issues that
  have already been fixed.

## Windows OS configuration

* **Configure Windows Security**. Windows Security may slow down the Kotlin/Native compiler. You can avoid this by adding the `.konan` directory, which is located in `%USERPROFILE%` by default, to Windows Security exclusions. Learn how to [add exclusions to Windows Security](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26).