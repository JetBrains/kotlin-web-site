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
  between builds. For example, redefine its location using the `kotlin.data.dir` Gradle property.

  Alternatively, you can use the `-Xkonan-data-dir` compiler option to configure your custom path to the directory via
  the `cinterop` and `konanc` tools.

## Gradle configuration

The first compilation with Gradle usually takes more time than subsequent ones due to the need to download the dependencies,
build caches, and perform additional steps. You should build your project at least twice to get an accurate reading of
the actual compilation times.

Here are some recommendations for configuring Gradle for better compilation performance:

* **Increase the [Gradle heap size](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)**.
  Add `org.gradle.jvmargs=-Xmx3g` to `gradle.properties`. If you use [parallel builds](https://docs.gradle.org/current/userguide/performance.html#parallel_execution),
  you might need to choose the right number of workers with the `org.gradle.workers.max` property or the `--max-workers` command-line option.
  The default value is the number of CPU processors. 

* **Build only the binaries you need**. Don't run Gradle tasks that build the whole project, such as `build` or `assemble`,
  unless you really need to. These tasks build the same code more than once, increasing the compilation times. In typical
  cases such as running tests from IntelliJ IDEA or starting the app from Xcode, the Kotlin tooling avoids executing unnecessary
  tasks. 
  
  If you have a non-typical case or build configuration, you might need to choose the task yourself.
    * `linkDebug*`: To run your code during development, you usually need only one binary, so running the corresponding
      `linkDebug*` task should be enough.
    * `embedAndSignAppleFrameworkForXcode`: Since iOS simulators and devices have different processor architectures, it's a common approach to
      distribute a Kotlin/Native binary as a universal (fat) framework. During local development, it will be faster to build
      the `.framework` for only the platform you're using.
      
      To build a platform-specific framework, call the `embedAndSignAppleFrameworkForXcode` task.

* **Build only for the target you need**. Similarly to the recommendation above, don't build a binary for all Native
  platforms at once. For example, compiling an [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks)
  (e.g., with an `*XCFramework` task) builds the same code for all targets, which takes proportionally more time than
  building for a single target.
  * If you do need XCFrameworks for your setup, you can reduce the number of targets.
    For example, you don't need `iosX64` if you don't run this project on iOS simulators on Intel-based Macs.

* **Don't build release binaries unless necessary**. Kotlin/Native supports
  [two build modes – debug and release](https://kotlinlang.org/docs/multiplatform-build-native-binaries.html#declare-binaries).
  Release is highly optimized, and this takes a lot of time: compilation of release binaries takes an order of magnitude
  more time than debug binaries. In a typical development cycle, all the optimizations might be unnecessary. So, if
  your development cycle uses a task with "Release" in its name, consider replacing it with "Debug". 

* **Don't disable the [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)** without having a
  good reason to. [Kotlin/Native runs from the Gradle daemon](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)
  by default. When it's enabled, the same JVM process is used and there is no need to warm it up for each compilation.

* **Don't use [transitiveExport = true](multiplatform-build-native-binaries.md#export-dependencies-to-binaries)**.
  Using transitive export disables dead code elimination in many cases: the compiler has to process a lot of unused code. It increases the compilation time.
  Use `export` explicitly for exporting the required projects and dependencies.

* **Use the Gradle [build caches](https://docs.gradle.org/current/userguide/build_cache.html)**:
    * **Local build cache**: Add `org.gradle.caching=true` to your `gradle.properties` or run with `--build-cache` on the command line.
    * **Remote build cache** in continuous integration environments. Learn how to [configure the remote build cache](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote).

* **Enable previously disabled features of Kotlin/Native**. There are properties that disable the Gradle daemon and compiler
  caches – `kotlin.native.disableCompilerDaemon=true` and `kotlin.native.cacheKind=none`. If you had issues with these
  features before and added these lines to your `gradle.properties` or Gradle arguments, remove them and check whether
  the build completes successfully. It is possible that these properties were added previously to work around issues that
  have already been fixed.

* **Try incremental compilation of klib artifacts**. With incremental compilation, if only a part of the `klib` artifact
  produced by the project module changes, just a part of `klib` is further
  recompiled into a binary.

  This feature is [Experimental](components-stability.md#stability-levels-explained). To enable it,
  add the `kotlin.incremental.native=true` option to your `gradle.properties` file. If you face any problems,
  create an [issue in YouTrack](https://kotl.in/issue).

## Windows OS configuration

* **Configure Windows Security**. Windows Security may slow down the Kotlin/Native compiler. You can avoid this by adding the `.konan` directory, which is located in `%\USERPROFILE%` by default, to Windows Security exclusions. Learn how to [add exclusions to Windows Security](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26).