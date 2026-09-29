[//]: # (title: How KSP models Kotlin code)
[//]: # (description: Learn how the KSP API models Kotlin source code through a hierarchy of symbols.)

KSP represents source code as a hierarchy of symbols. Processors can navigate this hierarchy to inspect declarations, 
types, annotations, and other elements of the source code.
Consider the following top-level function:

```Kotlin
import com.example.annotations.HelloWorldAnnotation

@HelloWorldAnnotation
fun main() {
    helloWorld()
}
```

KSP represents this function with the following symbol hierarchy:

```None
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

The `resolve()` calls in the hierarchy represent full type resolution. Type resolution is the most expensive KSP operation — read on to learn how it
works and when to use it.

## Type resolution

Some properties in the symbol hierarchy, such as `annotationType` and `returnType`, are represented as `KSTypeReference`. 
Processors can inspect these references directly or resolve them to access more information about the underlying type.

Properties that refer to types, such as `KSFunctionDeclaration.returnType` and `KSAnnotation.annotationType`, return a 
`KSTypeReference`.

```Kotlin
interface KSFunctionDeclaration : ... {
    val returnType: KSTypeReference?
    // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
    val element: KSReferenceElement?
    fun resolve(): KSType
}
```

A `KSTypeReference` represents an unresolved type and preserves the syntactic representation of the type as it appears 
in the source code. Its `KSReferenceElement` models the corresponding type element in Kotlin's grammar, including its 
annotations and modifiers.

You can inspect a `KSReferenceElement` without resolving it. It can be one of the following:

* `KSClassifierReference`, which provides information such as `referencedName`.

* `KSCallableReference`, which provides information such as `receiverType`, `functionParameters`, and `returnType`.

If a processor generates code that references the same types as the source code, it doesn't need to resolve those 
types. Instead, it can use the type names available from `KSTypeReference` to generate the same syntactic type reference. 
KSP adds the generated source files to the compilation, and the Kotlin compiler later resolves and type-checks the type 
references together with the rest of the source code.

`KSTypeReference.resolve()` resolves the reference to a `KSType`, which provides access to the declaration that defines 
the type:

```Kotlin
val ksTypeReference = functionDeclaration.returnType ?: return
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

For function type references, most information is already available from `KSCallableReference`. Resolving a function 
type produces a type from the `Function0`, `Function1`, and related families, and is usually unnecessary. However, 
resolution can provide additional information, such as the identity of the function's prototype.

### When to resolve types

Type resolution is one of the most expensive operations in the KSP API. To avoid unnecessary resolutions, KSP generally 
doesn't resolve type references implicitly. Instead, call `KSTypeReference.resolve()` explicitly when your processor 
needs the resolved type.

When possible, inspect the `KSReferenceElement` before resolving the type. For example, use 
`KSClassifierReference.referencedName()` to filter references that aren't relevant to your processor.

Whether a processor needs to resolve a type depends on the information it needs. The following example compares both 
approaches by inspecting the same property types with and without resolution. The processor provider uses the 
`resolveTypes` option to select which approach to use.

```Kotlin
import java.sql.Date as SqlDate

val birthday: SqlDate? = null
val names: List<String> = emptyList()
```

```Kotlin
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
                // Inspect the reference without explicitly resolving it.
                val element =
                    reference.element as? KSClassifierReference ?: continue

                logger.info(
                    "$name: writtenName=${element.referencedName()}, " +
                        "arguments=${element.typeArguments.size}",
                    property,
                )
            } else {
                // Resolve once, then reuse the resulting type.
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

With `resolveTypes = false`, the relevant output is:

```Kotlin
birthday: writtenName=SqlDate, arguments=0
names: writtenName=List, arguments=1
```

With `resolveTypes = true`, the output is:

```Kotlin
birthday: declaration=java.sql.Date, nullability=NULLABLE
names: declaration=kotlin.collections.List, nullability=NOT_NULL
```

Without resolution, the processor can inspect syntactic information such as the type name and type arguments. For 
example, it sees the imported alias `SqlDate` as written in the source code. After resolution, the processor can access 
semantic information about the type, such as the fully qualified declaration name and nullability.

## KSP model reference
The following diagram illustrates the relationships between the main KSP API types. It was generated from the KSP API 
source using IntelliJ IDEA's class diagram feature.

![The full class diagram of the KSP 2 model](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [See the full-sized diagram](https://kotlinlang.org/docs/images/ksp-class-diagram.svg).
>
{style="note"}

For the complete API definition, see the [KSP API source](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/) 
in the KSP GitHub repository.