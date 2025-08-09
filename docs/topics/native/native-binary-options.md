[//]: # (title: Kotlin/Native binary options)

This page lists helpful Kotlin/Native binary options that you can use to configure Kotlin/Native projects and the ways
to set them up in your project.

## How to enable

You can enable binary options in the `gradle.properties` file, your build file, or pass them as compiler arguments.

### In Gradle properties

You can set binary options in your project's `gradle.properties` file using `kotlin.native.binary`, for example:

```none
kotlin.native.binary.gc=cms
kotlin.native.binary.latin1Strings=true
```

### In your build file

You can set binary options for your project in your `build.gradle.kts` file:

* For specific binaries using the `binaryOption` attribute, for example:

  ```kotlin
  kotlin {
      iosArm64 {
          binaries {
              executable {
                  binaryOption("smallBinary", "true")
              }
          }
      }
  }
  ```

* As `-Xbinary=$option=$value` compiler options in the `freeCompilerArgs` attribute, for example:

  ```kotlin
  kotlin {
      iosArm64 {
          compilations.configureEach {
              compilerOptions.configure {
                  freeCompilerArgs.add("-Xbinary=smallBinary=true")
              }
          }
      }
  }
  ```

### In the command-line compiler

You can pass binary options as `-Xbinary=$option=$value` directly in the command line when executing
the [Kotlin/Native compiler](native-get-started.md#using-the-command-line-compiler),
for example:

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true tracking-pauses
```

## Binary options

<table column-width="fixed">
    <tr>
        <td width="240">Option</td>
        <td width="150">Values</td>
        <td>Description</td>
        <td width="110">Status</td>
    </tr>
    <tr>
        <td><a href="whatsnew-eap.md" anchor="smaller-binary-size-for-ios-targets"><code>smallBinary</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Decreases the binary size for iOS targets.</td>
        <td>Experimental since 2.2.20</td>
    </tr>
    <tr>
        <td><a href="whatsnew-eap.md" anchor="support-for-stack-canaries-in-binaries"><code>stackProtector</code></a></td>
        <td>
            <list>
                <li><code>yes</code></li>
                <li><code>strong</code></li>
                <li><code>all</code></li>
                <li><code>no</code> (default)</li>
            </list>
        </td>
        <td>Enables stack canaries: use <code>yes</code> for vulnerable functions, <code>all</code> for all functions, and <code>strong</code> to utilize stronger heuristic.</td>
        <td>Available since 2.2.20</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md" anchor="disable-allocator-paging"><code>pagedAllocator</code></a></td>
        <td>
            <list>
                <li><code>true</code> (default)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>Controls paging of allocations (buffering). When <code>false</code>, the memory allocator reserves memory on a per-object basis.</td>
        <td>Experimental since 2.2.0</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md" anchor="enable-support-for-latin-1-strings"><code>latin1Strings</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Controls support for Latin-1-encoded strings to reduce application binary size and adjust memory consumption.</td>
        <td>Experimental since 2.2.0</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md" anchor="track-memory-consumption-on-apple-platforms"><code>mmapTag</code></a></td>
        <td><code>UInt</code></td>
        <td>Controls memory tagging, necessary for memory consumption tracking on Apple platforms. Values <code>240</code>-<code>255</code> are available (default is <code>246</code>); <code>0</code> disables tagging</td>
        <td>Available since 2.2.0</td>
    </tr>
    <tr>
        <td><code>disableMmap</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Controls the default allocator. When <code>true</code>, uses the <code>malloc</code> memory allocator instead of <code>mmap</code>.</td>
        <td>Available since 2.2.0</td>
    </tr>
    <tr>
        <td><code>gc</code></td>
        <td>
            <list>
                <li><a href="native-memory-manager.md" anchor="optimize-gc-performance"><code>cms</code></a></li>
                <li><a href="native-memory-manager.md" anchor="disable-garbage-collection"><code>noop</code></a></li>
                <li><code>stms</code> (default)</li>
            </list>
        </td>
        <td>Controls garbage collection behavior: <code>cms</code> enables concurrent marking to decrease GC pause time, <code>noop</code> disables garbage collection.</td>
        <td><code>cms</code> is Experimental since 2.0.20</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md" anchor="garbage-collector"><code>gcMarkSingleThreaded</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Disables parallelization of the mark phase in garbage collection. May increase GC pause time on large heaps.</td>
        <td>Available since 1.7.20</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md" anchor="monitor-gc-performance"><code>enableSafepointSignposts</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Enables tracking GC-related pauses in the project for debugging in Xcode Instruments.</td>
        <td>Available since 2.0.20</td>
    </tr>
    <tr>
        <td><code>preCodegenInlineThreshold</code></td>
        <td><code>UInt</code></td>
        <td>Configures the inlining optimization pass, which comes before the actual code generation phase. The recommended number of tokens is 40.</td>
        <td>Experimental since 2.1.20</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md" anchor="deinitializers"><code>objcDisposeOnMain</code></a></td>
        <td>
            <list>
                <li><code>true</code> (default)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>Controls deinitialization of Swift/Objective-C objects. When <code>false</code>, deinitialization happens on a special GC thread instead of the main one.</td>
        <td>Available since 1.9.0</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md" anchor="support-for-background-state-and-app-extensions"><code>appStateTracking</code></a></td>
        <td>
            <list>
                <li><code>enabled</code></li>
                <li><code>disabled</code> (default)</li>
            </list>
        </td>
        <td>Controls timer-based invocation of the garbage collector. When <code>enabled</code>, GC is called only when memory consumption becomes too high.</td>
        <td>Experimental since 1.7.20</td>
    </tr>
    <tr>
        <td><code>bundleId</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>Sets bundle ID (<code>CFBundleIdentifier</code>) in the <code>Info.plst</code> file.</td>
        <td>Available since 1.7.20</td>
    </tr>
    <tr>
        <td><code>bundleShortVersionString</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>Sets short bundle version (<code>CFBundleShortVersionString</code>) in the <code>Info.plst</code> file.</td>
        <td>Available since 1.7.20</td>
    </tr>
    <tr>
        <td><code>bundleVersion</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>Sets bundle version (<code>CFBundleVersion</code>) in the <code>Info.plst</code> file.</td>
        <td>Available since 1.7.20</td>
    </tr>
    <tr>
        <td><code>sourceInfoType</code></td>
        <td>
            <list>
                <li><code>libbacktrace</code></li>
                <li><code>coresymbolication</code></li>
                <li><code>noop</code> (default)</li>
            </list>
        </td>
        <td>Controls stack trace generation. <code>libbacktrace</code> enables better stack traces with file locations and line numbers.</td>
        <td>Experimental since 1.6.20</td>
    </tr>
    <!-- <tr>
        <td><code>objcExportReportNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>When <code>enabled</code>, reports warnings in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>objcExportErrorOnNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>When <code>true</code>, issues errors in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>debugCompilationDir</code></td>
        <td><code>String</code></td>
        <td>Specifies the directory path to use for debug information in the compiled binary.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>fixedBlockPageSize</code></td>
        <td><code>UInt</code></td>
        <td>Controls the page size for fixed memory blocks in the memory allocator. Affects memory allocation performance and fragmentation.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>gcMutatorsCooperate</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Controls cooperation between mutator threads and the garbage collector.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>auxGCThreads</code></td>
        <td><code>UInt</code></td>
        <td>Specifies the number of auxiliary threads to use for garbage collection.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>sanitizer</code></td>
        <td>
            <list>
                <li><code>address</code></li>
                <li><code>thread</code></li>
            </list>
        </td>
        <td>Enables runtime sanitizers for detecting various issues like memory errors, data races, and undefined behavior.</td>
        <td>Experimental</td>
    </tr> -->
</table>

For more information on stability levels, see the [documentation](components-stability.md#stability-levels-explained).
