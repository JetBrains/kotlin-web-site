[//]: # (title: Debugging Kotlin/Native)

The Kotlin/Native compiler can generate binaries with debug information, as well as create debug symbol files for [symbolicating
crash reports](#debug-ios-applications).

The debug information is compatible with the [DWARF 2](https://dwarfstd.org/download.html) specification, so modern debugger
tools, like LLDB and GDB can:

* [Set breakpoints](#set-breakpoints)
* [Use stepping](#use-stepping)
* [Inspect variable and type information](#inspect-variables)

> Supporting the DWARF 2 specification means that the debugger tool recognizes Kotlin as C89, because before the DWARF 5
> specification, there is no identifier for the Kotlin language type in the specification.
>
{style="note"}

## Generate binaries with debug information

When debugging in IntelliJ IDEA, Android Studio, or Xcode, binaries with debug information are generated automatically
(unless the build is configured differently).

You can enable debugging manually and produce binaries that include debug information by:

* **Using Gradle tasks**. To get debug binaries, use `linkDebug*` Gradle tasks, for example:

  ```bash
  ./gradlew linkDebugFrameworkNative
  ```

  The tasks differ depending on the binary type (for example, `linkDebugSharedNative`) or your target (for example, `linkDebugExecutableMacosArm64`).

* **Using the command-line compiler**. In the command line, compile your Kotlin/Native binary with the `-g` option:

  ```bash
  kotlinc-native hello.kt -g -o terminator
  ```

Then launch your debugger tool. For example:

```bash
lldb terminator.kexe
```

The debugger outputs:

```bash
$ cat - > hello.kt
fun main(args: Array<String>) {
  println("Hello world")
  println("I need your clothes, your boots and your motorcycle")
}
$ dist/bin/konanc -g hello.kt -o terminator
KtFile: hello.kt
$ lldb terminator.kexe
(lldb) target create "terminator.kexe"
Current executable set to 'terminator.kexe' (x86_64).
(lldb) b kfun:main(kotlin.Array<kotlin.String>)
Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
(lldb) r
Process 28473 launched: '/Users/minamoto/ws/.git-trees/debugger-fixes/terminator.kexe' (x86_64)
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x00000001000012e4 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:2
   1    fun main(args: Array<String>) {
-> 2      println("Hello world")
   3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb) n
Hello world
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = step over
    frame #0: 0x00000001000012f0 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:3
   1    fun main(args: Array<String>) {
   2      println("Hello world")
-> 3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb)
```

## Set breakpoints

Modern debuggers provide several ways to set a breakpoint. See below for a tool-by-tool breakdown:

### LLDB

* By name:

  ```bash
  (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
  Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

  `-n` is optional, it's applied by default.

* By location (filename, line number):

  ```bash
  (lldb) b -f hello.kt -l 1
  Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

* By address:

  ```bash
  (lldb) b -a 0x00000001000012e4
  Breakpoint 2: address = 0x00000001000012e4
  ```

* By regex. You might find it useful for debugging generated artifacts, like a lambda (with the `#` symbol in the name):

  ```bash
  (lldb) b -r main\(
  3: regex = 'main\(', locations = 1
    3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
  ```

### GDB

* By regex:

  ```bash
  (gdb) rbreak main(
  Breakpoint 1 at 0x1000109b4
  struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
  ```

* By name is _not_ possible because `:` is a separator for the breakpoint by location:

  ```bash
  (gdb) b kfun:main(kotlin.Array<kotlin.String>)
  No source file named kfun.
  Make breakpoint pending on future shared library load? (y or [n]) y
  Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
  ```

* By location:

  ```bash
  (gdb) b hello.kt:1
  Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
  ```

* By address:

  ```bash
  (gdb) b *0x100001704
  Note: breakpoint 2 also set at pc 0x100001704.
  Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
  ```

## Use stepping

Stepping through functions works mostly the same way as for C/C++ programs.

## Inspect variables

Variable inspection for `var` variables works out of the box for both primitive and non-primitive types:

```bash
$ cat -n main.kt
     1  fun main(args: Array<String>) {
     2      var x = 1
     3      var y = 2
     4      var p = Point(x, y)
     5      println("p = $p")
     6  }
     7 
     8  data class Point(val x: Int, val y: Int)

$ lldb ./program.kexe -o 'b main.kt:5' -o
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b main.kt:5
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 289 at main.kt:5
(lldb) r
Process 4985 stopped
* thread #1, name = 'program.kexe', stop reason = breakpoint 1.1
    frame #0: program.kexe`kfun:main(kotlin.Array<kotlin.String>) at main.kt:5
   2        var x = 1
   3        var y = 2
   4        var p = Point(x, y)
-> 5        println("p = $p")
   6    }
   7   
   8    data class Point(val x: Int, val y: Int)

Process 4985 launched: './program.kexe' (x86_64)
(lldb) fr var
(int) x = 1
(int) y = 2
(ObjHeader *) p = Point(x=1, y=2)

(lldb) v p->x
(int32_t) p->x = 1
```

## Debug iOS applications

Debugging iOS applications sometimes involves analyzing crash reports in detail. Crash reports typically require
symbolication, the process of translating memory addresses into readable source code locations.

To symbolicate addresses in Kotlin code (for example, for stack trace elements corresponding to Kotlin code), you need a
special debug symbol (`.dSYM`) file. This file maps memory addresses in crash reports with actual locations in the source
code, such as functions or line numbers.

The Kotlin/Native compiler generates `.dSYM` files for release (optimized) binaries on Apple platforms by default.
When building in Xcode, the IDE looks for `.dSYM` files in standard locations and uses them automatically for symbolication.
Xcode automatically detects `.dSYM` files in projects created from IntelliJ IDEA templates.

On other platforms, you can add debug information into the produced binaries (which increases their size)
using the `-Xadd-light-debug` compiler option:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
</tabs>

For more information about crash reports, see the [Apple documentation](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs).

## Known issues

* Performance of Python bindings.
* Expression evaluation in debugger tools is not supported, and currently there are no plans for implementing it.
