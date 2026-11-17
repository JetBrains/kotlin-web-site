[//]: # (title: How KSP models Kotlin code)

<web-summary>Learn how the KSP API models Kotlin source code as a hierarchy of symbols, and
how to avoid expensive analysis.</web-summary>

KSP represents source code as a hierarchy of symbols. Processors can navigate this hierarchy to inspect declarations,
types, annotations, and other elements of the source code.
Consider the following top-level function:

```kotlin
import com.example.annotations.HelloWorldAnnotation

@HelloWorldAnnotation
fun main() {
    helloWorld()
}
```

KSP represents this function with the following symbol hierarchy:

```text
KSFile: packageName = "" (root package)
└── declarations
    └── KSFunctionDeclaration: main
        ├── simpleName = "main"
        ├── qualifiedName = "main"
        ├── parentDeclaration = null
        ├── functionKind = TOP_LEVEL
        ├── annotations
        │   └── KSAnnotation: @HelloWorldAnnotation
        │       ├── shortName = "HelloWorldAnnotation"
        │       └── annotationType: KSTypeReference
        │           └── resolve().declaration.qualifiedName
        │               → com.example.annotations.HelloWorldAnnotation
        ├── parameters = []
        ├── typeParameters = []
        ├── extensionReceiver = null
        └── returnType: KSTypeReference
            └── resolve() → kotlin.Unit, NOT_NULL
```

The `resolve()` calls in the hierarchy represent full type resolution. Unlike inspecting a type reference as written,
resolving it requires KSP to analyze its context and determine the type it refers to. This additional analysis makes
type resolution one of the most expensive operations in the KSP API.

## Type resolution

Properties that refer to types, such as `KSAnnotation.annotationType` and `KSFunctionDeclaration.returnType`, return a
`KSTypeReference`. Depending on the property, it can be nullable, as with `returnType`. Processors can inspect these
references directly or resolve them to access more information about the underlying type:

```kotlin
interface KSFunctionDeclaration : ... {
    val returnType: KSTypeReference?
    // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
    val element: KSReferenceElement?
    fun resolve(): KSType
}
```

A `KSTypeReference` represents an unresolved type. It preserves the syntactic representation of the type as it appears
in the source code, including its annotations and modifiers. Its `element` property holds a `KSReferenceElement`, which
models the corresponding type element in Kotlin's grammar.

You can inspect a `KSReferenceElement` without resolving it. The most common kinds of reference elements are the following:

* `KSClassifierReference`, which provides information such as `referencedName()`.
* `KSCallableReference`, which provides information such as `receiverType`, `functionParameters`, and `returnType`.

If a processor generates code that references the same types as the source code, it doesn't need to resolve those
types. Instead, it can use the type names available from `KSTypeReference` to generate the same syntactic type reference.
KSP adds the generated source files to the compilation, and the Kotlin compiler later resolves and type-checks the type
references together with the rest of the source code.

`KSTypeReference.resolve()` resolves the reference to a `KSType`, which provides access to the declaration that defines
the type:

```kotlin
val ksTypeReference = functionDeclaration.returnType ?: return
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

For function type references, most information is already available from `KSCallableReference`. Resolving a function
type produces a type from the `Function0`, `Function1`, and related families, and is usually unnecessary. However,
resolution can provide additional information, such as the identity of the function's prototype.

### When to resolve types

Type resolution is one of the most expensive operations in the KSP API. To avoid unnecessary resolutions, KSP generally
doesn't resolve type references implicitly. If your processor needs the resolved type, call `KSTypeReference.resolve()`
explicitly instead.

When possible, inspect the `KSReferenceElement` before resolving the type. For example, use
`KSClassifierReference.referencedName()` to filter references that aren't relevant to your processor.

Whether a processor needs to resolve a type depends on the information it needs. The following example compares both
approaches by inspecting the same property types with and without resolution. It uses these top-level properties as
input:

```kotlin
import java.sql.Date as SqlDate

val birthday: SqlDate? = null
val names: List<String> = emptyList()
```

The processor provider passes the `resolveTypes` option to the processor to select which approach to use:

```kotlin
import com.google.devtools.ksp.processing.*
import com.google.devtools.ksp.symbol.*

class TypeInventoryProcessor(
    private val logger: KSPLogger,
    private val resolveTypes: Boolean,
) : SymbolProcessor {

    override fun process(resolver: Resolver): List<KSAnnotated> {
        val deferred = mutableListOf<KSAnnotated>()

        // This example inspects only top-level properties.
        val properties = resolver.getAllFiles()
            .flatMap { it.declarations }
            .filterIsInstance<KSPropertyDeclaration>()

        for (property in properties) {
            val name = property.simpleName.asString()
            val reference = property.type

            if (!resolveTypes) {
                // Inspects the reference without explicitly resolving it.
                val element =
                    reference.element as? KSClassifierReference ?: continue

                logger.info(
                    "$name: writtenName=${element.referencedName()}, " +
                        "arguments=${element.typeArguments.size}",
                    property,
                )
            } else {
                // Resolves the reference once, then reuses the resulting type.
                val type = reference.resolve()

                if (type.isError) {
                    deferred += property
                    continue
                }

                logger.info(
                    "$name: declaration=" +
                        "${type.declaration.qualifiedName?.asString()}, " +
                        "nullability=${type.nullability}",
                    property,
                )
            }
        }
        return deferred
    }
}
```

If `resolveTypes = false`, the output is the following:

```text
birthday: writtenName=SqlDate, arguments=0
names: writtenName=List, arguments=1
```

If `resolveTypes = true`, the output is the following:

```text
birthday: declaration=java.sql.Date, nullability=NULLABLE
names: declaration=kotlin.collections.List, nullability=NOT_NULL
```

Without resolution, the processor can inspect syntactic information like type name and type arguments. For
example, it handles the imported alias `SqlDate` as written in the source code. After resolution, the processor can access
semantic information about the type, such as the fully qualified declaration name and nullability.

## KSP model reference

The following diagram illustrates the relationships between the main KSP API types.

![The full class diagram of the KSP 2 model.](ksp-class-diagram.svg){thumbnail="true" width="700" thumbnail-same-file="true"}

> [See the full-sized diagram](https://kotlinlang.org/docs/images/ksp-class-diagram.svg).
>
{style="tip"}

For the complete API definition, see the [KSP API source](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)
in the KSP GitHub repository.

## See also

* Learn how to add a processor to your project or create your own in [Getting started with KSP](ksp-quickstart.md).
* Find the KSP equivalents of Java annotation processing APIs in the
  [Java annotation processing to KSP reference](ksp-reference.md).
* Learn how KSP tracks type resolution to [decide which files to reprocess](ksp-incremental.md#dirtiness-propagation).
* Explore the [example projects](https://github.com/google/ksp/tree/main/examples) in the KSP repository.
* Watch the [Kotlin Symbol Processing (KSP)](https://www.youtube.com/watch?v=bv-VyGM3HCY) video on the Kotlin by JetBrains
  YouTube channel.
