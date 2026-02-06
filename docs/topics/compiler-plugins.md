[//]: # (title: Compiler plugins)

This page explains the Kotlin compiler plugins available to you and what you can do if none of them suits your use case.

Compiler plugins hook into the compilation process to analyze or change code while it's being compiled, without modifying the compiler itself. For example, they can annotate code or generate new code to make it compatible with other frameworks or APIs.

The Kotlin team maintains the following compiler plugins:
* [All-open](all-open-plugin.md)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [DataFrame](https://kotlin.github.io/dataframe/compiler-plugin.html)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](kapt.md)
* [Lombok](lombok.md)
* [`no-arg`](no-arg-plugin.md)
* [Power-assert](power-assert.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Serialization](serialization.md)

The Android team at Google maintains the [Compose compiler Gradle plugin](https://developer.android.com/develop/ui/compose/compiler)
and the [Parcelize plugin](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize).

If you need to adapt the compilation process in a way that these plugins don't cover, first check whether you can use the
[Kotlin Symbol Processing (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) or an external linter such as [Android lint](https://developer.android.com/studio/write/lint).
You can browse our [Kotlin Slack](https://slack-chats.kotlinlang.org/c/compiler) or [reach out](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
and ask for advice about your use case.

If you _still_ can't find what you need, you can create a custom compiler plugin. Use this approach only as a last resort,
because the Kotlin compiler plugin API is **unstable**. Maintaining a custom compiler plugin requires significant ongoing
effort, since each new compiler release introduces breaking changes.

## Custom compiler plugins

> The Kotlin compiler plugin API is unstable and includes breaking changes in every release.
> 
{style="warning"}

Compiler plugins can influence different stages of the compilation process depending on their use case.

![Kotlin compiler stages](compiler-stages.svg){width=650}

The Kotlin compiler first parses the source code and turns it into a structured syntax tree. During analysis and resolution,
the compiler determines what the code means by resolving names, checking types, and enforcing visibility.

After that, the compiler generates an Intermediate Representation (IR), which is a data structure the compiler uses as a
bridge between source code and machine code. This IR is progressively lowered into simpler forms and finally translated
into target-specific output, such as JVM bytecode, JavaScript, or native machine code.

Plugins that affect the initial compiler stages by changing how the compiler resolves code are called frontend plugins.
For example, they can add annotations or introduce new methods without bodies, or change visibility modifiers. These 
changes are visible in the IDE.

Plugins that affect the later compiler stages by changing the behavior of declarations are called backend plugins. These
changes appear in the binaries produced after compilation completes.

In practice, the most common compiler plugins affect the stages from analysis and resolution through code generation, 
covering both frontend and backend. For example, the frontend part generates declarations, and the backend part adds 
bodies for those declarations.

The [Kotlin serialization plugin](https://github.com/Kotlin/kotlinx.serialization) is a good example. The plugin's 
frontend part adds a companion object and a serializer function, as well as checks to prevent name conflicts. The backend
part implements the desired serialization behavior through `KSerializer` objects.

### Kotlin compiler plugin template

To start writing a custom compiler plugin, you can use the [Kotlin compiler plugin template](https://github.com/Kotlin/compiler-plugin-template).
You then register extension points from the frontend and backend plugin APIs.

> Currently, you can develop custom compiler plugins only with [Gradle](gradle.md).
> 
{style="note"}

### Frontend plugin API

The frontend plugin API, also known as frontend intermediate representation (FIR), has the following specialized 
extension points to customize resolution:

| Extension name                                                                                                                                                                               | Description                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| [`FirAdditionalCheckersExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) | Add custom compiler checkers.                                                           |
| [`FirDeclarationGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt)   | Generate new declarations.                                                              |
| [`FirExtensionSessionComponent`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtensionSessionComponent.kt)                  | Register custom components in the `FirSession` to be used by other parts of the plugin. |
| [`FirFunctionTypeKindExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirFunctionTypeKindExtension.kt)                  | Define new families of functional types.                                                |
| [`FirMetadataSerializerPlugin`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/fir-serialization/src/org/jetbrains/kotlin/fir/serialization/FirMetadataSerializerPlugin.kt)    | Read and write information to declaration metadata.                                     |
| [`FirStatusTransformerExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt)             | Modify declaration status attributes such as visibility or modality.                    |
| [`FirSupertypeGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt)         | Add new supertypes to an existing class.                                                |
| [`FirTypeAttributeExtension`]( https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirTypeAttributeExtension.kt)                       | Add special attributes to certain types based on their type annotations.                |

#### IDE integration

Each version of Intellij IDEA and Android Studio includes a developer version of the Kotlin compiler. This version is 
specific to the IDE and is not binary compatible with the released Kotlin compiler. As a result, when you update your IDE,
your compiler plugin needs changes to work again. For this reason, community plugins aren't loaded by default.

To ensure that your custom compiler plugin works with different IDE versions, test it against each IDE version and fix 
any issues you find.

Supporting multiple IDE versions could become easier if a devkit for Kotlin compiler plugins were available. If you're 
interested in this feature, share your feedback in our [issue tracker](https://youtrack.jetbrains.com/issue/KT-82617).

### Backend plugin API

> Backend plugin development is difficult to do correctly without degrading IDE or debugger performance, so be careful 
> and conservative with your changes.
> 
{style="warning"}

The backend plugin API, also known as IR, has a single extension point: [`IrGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/ir/backend.common/src/org/jetbrains/kotlin/backend/common/extensions/IrGenerationExtension.kt).
Use this extension point and override the `generate()` function to add bodies to declarations already generated by the 
frontend or change existing declaration bodies.

Changes made through this extension point are **not checked**. You must ensure that your changes don't break the compiler's
expectations at this stage. For example, you might accidentally introduce an invalid type, an incorrect function reference,
or a reference outside the correct scope.

#### Check your backend plugin for problems

You can check for problems in your backend plugin code in three main ways:

1. **Verify the IR**

    Build the IR tree and enable the `Xverify-ir` compiler option. This option has a performance impact on compilation speed, so use it only during testing.

2. **Dump and compare IR output**

    Create a dump file after the IR lowering compilation stage with the `-Xphases-to-dump-before=ExternalPackageParentPatcherLowering` compiler option. For the JVM backend, configure the dump directory with the `-Xdump-directory=<your-file-directory>` compiler option. Write the expected code manually, generate another dump file, and compare the two to see if there are differences.

3. **Debug the compiler code**

    In the `convertToIr.kt` file, add breakpoints in the `convertToIrAndActualize()` function and run the compiler in debug mode to get more detailed information during compilation.

You can also explore the Kotlin serialization plugin code to see what backend plugin compiler code looks like in practice. 
For example, [`SerializableCompanionIrGenerator.kt`](https://github.com/JetBrains/kotlin/blob/master/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt) 
fills in missing bodies for key serializer members. One example is the [`generateChildSerializersGetter()`](https://github.com/JetBrains/kotlin/blob/9cfa558902abc13d245c825717026af63ef82dd2/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt#L242)
function, which collects a list of `KSerializer` expressions and returns them in an array.

### Test your plugin

Once you implement your plugin, test it thoroughly. The [Kotlin compiler plugin template](https://github.com/Kotlin/compiler-plugin-template) 
is already set up to use the [Kotlin compiler test framework](https://github.com/JetBrains/kotlin/blob/master/compiler/test-infrastructure/ReadMe.md).
You can add tests in the following directories:

* `compiler-plugin/testData`
* `compiler-plugin/testData/box` for code generation tests
* `compiler-plugin/testData/diagnostics` for diagnostic tests

When a test runs, the framework:

1. Parses the test source file. For example, [`anotherBoxTest.kt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.kt)
2. Builds the FIR and IR for each file.
3. Writes these as textual dump files. For example, [`anotherBoxTest.fir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.txt) and [`anotherBoxTest.fir.ir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.ir.txt).
4. Compares these files with previously created files, if they exist.

You can use these files to check if any changes in the generated diff weren't intended. If there are no problems, the 
new dump files become your latest _golden_ files: an approved and trusted source that you can compare future changes against.

### Get help

If you run into issues developing a custom compiler plugin, reach out in [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
in the [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) channel. We can't promise a solution but we will try 
to help if we can.