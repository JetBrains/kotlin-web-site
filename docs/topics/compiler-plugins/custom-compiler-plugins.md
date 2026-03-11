[//]: # (title: Custom compiler plugins)

> The Kotlin compiler plugin API is unstable and introduces breaking changes in every release.
> 
{style="warning"}

<include from="compiler-plugins-overview.md" element-id="compiler-plugin-description"/>

Before you create your own custom compiler plugin, check the [list of available compiler plugins](compiler-plugins-overview.md) to see if one is already available that suits your use case.

You can also check whether you can use the [Kotlin Symbol Processing (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) or an external linter such as [Android lint](https://developer.android.com/studio/write/lint) to achieve your goals.

If you _still_ can't find what you need, you can create a custom compiler plugin. Be aware that the Kotlin compiler plugin
API is **unstable**. You need to invest significant ongoing effort to maintain it, since each new compiler release introduces breaking changes.

### The Kotlin compiler and compiler plugins

<p></p> <!-- workaround for MRK057: Paragraph can only contain inline elements-->
<list columns="2">
    <li>
        <p></p>
        <br/>
        <img src="compiler-stages.svg" width="400" alt="Kotlin compiler stages"/>
    </li>
    <li>
        <p>The Kotlin compiler:</p>
        <ol>
            <li>Parses the source code and turns it into a structured syntax tree.</li>
            <li>Analyzes and resolves the code by determining what it means, resolving names, checking types, and enforcing visibility rules.</li>
            <li>Generates an Intermediate Representation (IR), a data structure that acts as a bridge between source code and machine code. </li>
            <li>Progressively lowers the IR into simpler forms.</li>
            <li>Translates the lowered IR into target-specific output, such as JVM bytecode, JavaScript, or native machine code.</li>
        </ol>
    </li>
</list>

Plugins can affect the initial compiler stages through the frontend API, changing how the compiler resolves code.
For example, a plugin can add annotations or introduce new methods without bodies, or change visibility modifiers. These 
changes are visible in the IDE.

Plugins can also affect the later stages through the backend API, modifying the behavior of declarations. These
changes appear in the binaries produced after compilation completes.

In practice, compiler plugins affect the stages from analysis and resolution through code generation, 
covering both frontend and backend. For example, the frontend part generates declarations, and the backend part adds 
bodies for those declarations.

![Kotlin compiler stages with plugins](compiler-stages-with-plugins.svg){width=650}

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

| Extension name                                                                                                                                                                               | Description                                                                              |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| [`FirAdditionalCheckersExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) | Adds custom compiler checkers.                                                           |
| [`FirDeclarationGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt)   | Generates new declarations.                                                              |
| [`FirExtensionSessionComponent`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtensionSessionComponent.kt)                  | Registers custom components in the `FirSession` to be used by other parts of the plugin. |
| [`FirFunctionTypeKindExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirFunctionTypeKindExtension.kt)                  | Defines new families of functional types.                                                |
| [`FirMetadataSerializerPlugin`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/fir-serialization/src/org/jetbrains/kotlin/fir/serialization/FirMetadataSerializerPlugin.kt)    | Reads and writes information to declaration metadata.                                    |
| [`FirStatusTransformerExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt)             | Modifies declaration status attributes such as visibility or modality.                   |
| [`FirSupertypeGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt)         | Adds new supertypes to an existing class.                                                |
| [`FirTypeAttributeExtension`]( https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirTypeAttributeExtension.kt)                       | Adds special attributes to certain types based on their type annotations.                |

#### IDE integration

Resolution changes affect IDE behavior such as code highlighting and suggestions, so it's important
that your plugin is compatible with the IDE. Each version of Intellij IDEA and Android Studio includes a development version
of the Kotlin compiler. This version is specific to the IDE and is not binary compatible with the released Kotlin compiler.
As a result, when you update your IDE, you also need to update your compiler plugin to keep it working. For this reason,
community plugins aren't loaded by default.

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

Changes made through this extension point are **not checked** by the compiler. You must ensure that your changes don't break the compiler's
expectations at this stage. For example, you might accidentally introduce an invalid type, an incorrect function reference,
or a reference outside the correct scope.

#### Explore backend plugin code

You can explore the Kotlin serialization plugin code to see what backend plugin compiler code looks like in practice.
For example, [`SerializableCompanionIrGenerator.kt`](https://github.com/JetBrains/kotlin/blob/master/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt)
fills in missing bodies for key serializer members. One example is the [`generateChildSerializersGetter()`](https://github.com/JetBrains/kotlin/blob/9cfa558902abc13d245c825717026af63ef82dd2/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt#L242)
function, which collects a list of `KSerializer` expressions and returns them in an array.

#### Check your backend plugin code for problems

You can check for problems in your backend plugin code in three ways:

1. **Verify the IR**

    Build the IR tree and enable the `Xverify-ir` compiler option. This option has a performance impact on compilation speed, so use it only during testing.

2. **Dump and compare IR output**

    Create a dump file after the IR lowering compilation stage with the `-Xphases-to-dump-before=ExternalPackageParentPatcherLowering` compiler option. For the JVM backend, configure the dump directory with the `-Xdump-directory=<your-file-directory>` compiler option. Write the expected code manually, generate another dump file, and compare the two to see if there are differences.

3. **Debug the compiler code**

    In the `convertToIr.kt` file, add breakpoints in the `convertToIrAndActualize()` function and run the compiler in debug mode to get more detailed information during compilation.

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
in the [#compiler](https://slack-chats.kotlinlang.org/c/compiler) channel. We can't promise a solution but we will try 
to help if we can.