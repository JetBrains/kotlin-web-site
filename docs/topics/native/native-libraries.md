[//]: # (title: Kotlin/Native libraries)

## Library compilation

You can use your project's build file or the Kotlin/Native compiler to produce a `*.klib` artifact for your library.

### Using Gradle build file

You can compile a `*.klib` library artifact by specifying a [Kotlin/Native target](native-target-support.md)
in your Gradle build file:

1. In your `build.gradle(.kts)` file, declare at least one Kotlin/Native target. For example:

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }
 
   kotlin {
       macosArm64()    // on macOS
       // linuxArm64() // on Linux
       // mingwX64()   // on Windows
   }
   ```

2. Run the `<target>Klib` task. For example:

   ```bash
   ./gradlew macosArm64Klib
   ```

Gradle automatically compiles source files for that target and produces the `.klib` artifact in the project's `build/libs`
directory.

### Using Kotlin/Native compiler

To produce a library with the Kotlin/Native compiler:

1. [Download and install the Kotlin/Native compiler.](native-get-started.md#download-and-install-the-compiler)
2. To compile a Kotlin/Native source file into a library, use the `-produce library` or `-p library` option:

   ```bash
   kotlinc-native foo.kt -p library -o bar
   ```

   This command compiles the contents of the `foo.kt` file into a library with the name `bar`, producing a `bar.klib` artifact.

3. To link another file to a library, use the `-library <name>` or `-l <name>` option. For example:

   ```bash
   kotlinc-native qux.kt -l bar
   ```
   
   This command compiles the contents of the `qux.kt` source file and the `bar.klib` library and produces the `program.kexe`
   final executable binary.

## klib utility

The **klib** library management utility allows you to inspect libraries using the following syntax:

```bash
klib <command> <library path> [<option>]
```

The following commands are currently available:

| Command                       | Description                                                                                                                                                                                                                                                                                                                                                    |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | General information about the library.                                                                                                                                                                                                                                                                                                                         |
| `dump-abi`                    | Dump the ABI snapshot of the library. Each line in the snapshot corresponds to one declaration. In case an ABI-incompatible change happens to a declaration, it'll be visible in the corresponding line of the snapshot.                                                                                                                                       |
| `dump-ir`                     | Dump the intermediate representation (IR) of library declarations to the output. Use it only for debugging.                                                                                                                                                                                                                                                    |
| `dump-ir-signatures`          | Dump IR signatures of all non-private library declarations and all non-private declarations consumed by this library (as two separate lists). This command relies purely on the data in IR.                                                                                                                                                                    |
| `dump-ir-inlinable-functions` | Dump the IR of inlinable functions in the library to the output. Use it only for debugging.                                                                                                                                                                                                                                                                    |
| `dump-metadata`               | Dump the metadata of all library declarations to the output. Use it only for debugging.                                                                                                                                                                                                                                                                        |
| `dump-metadata-signatures`    | Dump IR signatures of all non-private library declarations based on the library metadata. In most cases, the output is the same as for the `dump-ir-signatures` command, which renders signatures based on IR. However, if IR-transforming compiler plugins (such as Compose) are used during compilation, patched declarations may have different signatures. |

All the above dumping commands accept an additional `-signature-version {N}` argument that instructs the klib utility
which IR signature version to render when dumping signatures. If not provided, it uses the most up‑to‑date version
supported by the library. For example:

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

In addition, the `dump-metadata` command accepts the `-print-signatures {true|false}` argument that instructs the klib
utility to print the IR signatures for every declaration in the output.

## Creating and using a library

1. Create a library by placing the source code into `kotlinizer.kt`:

   ```kotlin
   package kotlinizer

   val String.kotlinized
       get() = "Kotlin $this"
   ```

2. Compile the library into a `.klib`:

   ```bash
   kotlinc-native kotlinizer.kt -p library -o kotlinizer
   ```

3. Check the current directory for the created library:

   ```bash
   ls kotlinizer.klib
   ```

4. Check out general information about the library:

   ```bash
   klib info kotlinizer.klib
   ```

5. Create a short program in the `use.kt` file:

   ```kotlin
   import kotlinizer.*

   fun main(args: Array<String>) {
       println("Hello, ${"world".kotlinized}!")
   }
   ```

6. Compile the program, linking the `use.kt` source file to your library:

   ```bash
   kotlinc-native use.kt -l kotlinizer -o kohello
   ```

7. Run the program:

   ```bash
   ./kohello.kexe
   ```

You should see `Hello, Kotlin world!` in the output.

## Library search sequence

> The library search mechanism will change soon. Expect updates to this section and avoid relying on deprecated flags.
> 
{style="note"}

When given a `-library foo` option, the compiler searches the `foo` library in the following order:

1. Current compilation directory or an absolute path.
2. Libraries installed in the default repository.

   > The default repository is `~/.konan`. You can change it by setting the `konan.data.dir` Gradle property.
   > 
   > Alternatively, you can use the `-Xkonan-data-dir` compiler option to configure your custom path to the directory 
   > via the `cinterop` and `konanc` tools.
   > 
   {style="note"}

3. Libraries installed in the `$installation/klib` directory.

## Library format

Kotlin/Native libraries are zip files containing a predefined directory structure, with the following layout:

`foo.klib` when unpacked as `foo/` gives us:

```text
- foo/
  - $component_name/
    - ir/
      - Serialized Kotlin IR.
    - targets/
      - $platform/
        - kotlin/
          - Kotlin compiled to LLVM bitcode.
        - native/
          - Bitcode files of additional native objects.
      - $another_platform/
        - There can be several platform specific kotlin and native pairs.
    - linkdata/
      - A set of ProtoBuf files with serialized linkage metadata.
    - resources/
      - General resources such as images. (Not used yet).
    - manifest - A file in the java property format describing the library.
```

You can find an example layout in the `klib/common/stdlib` directory of your Kotlin/Native compiler installation.

## Using relative paths in klibs

A serialized IR representation of source files is [a part of](#library-format) a `klib` library. It includes paths of 
files for generating proper debug information. By default, stored paths are absolute.

With the `-Xklib-relative-path-base` compiler option, you can change the format and use only relative paths in the 
artifact. To make it work, pass one or multiple base paths of source files as an argument:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base is a base path of source files
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base is a base path of source files
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>

## What's next?

[Learn how to use the cinterop tool to produce `*.klib` artifacts](native-definition-file.md)