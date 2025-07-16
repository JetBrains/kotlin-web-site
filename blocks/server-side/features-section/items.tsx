import React, { ReactNode } from 'react';

import DiamondIcon from './diamond.svg';

interface FeatureItem {
    id: string;
    icon: ImgSrc;
    title: string;
    description: ReactNode;
}

interface FeatureSlideItem extends FeatureItem {
    codeSample: string;
}

export const featureSlideshowItems: FeatureSlideItem[] = [
    {
        id: 'null-safety',
        icon: DiamondIcon,
        title: 'Null-safety',
        description: 'Switching backend development to Kotlin significantly reduces crashes at runtime.',
        codeSample: `val b: String? = "Kotlin"
// reduction of null-pointer exceptions is achieved by 
// explicit nullable types (String?) and enforced compile-time checks (?.)

val length: Int? = b?.length 
// b.length <-- won't compile, length can only access safely

if (b != null && b.length > 0) {
    print("String of length \${b.length}")
} else {
    print("Empty string")
}
// Kotlin smart-casts b to a non-null value after an != null check.
// It makes code clearer and easier tofor debugging and maintainenance.
`,
    },
    {
        id: 'immutability',
        icon: DiamondIcon,
        title: 'Immutability',
        description: `Immutable data by default:\n 
- Immutable collections reduce concurrency issues
- Easier reasoning about application state
- Improved predictability
`,
        codeSample: `data class Config(val host: String, val port: Int)

val config = Config(host = "localhost", port = 8080)

// config.port = 8081 <-- won't compile, val cannot be changed

val updatedConfig = config.copy(port = 8081)
// Kotlin's data classes, immutability, and the built-in .copy() function 
// simplify safe object updates and state management, directly enhancing code stability.

println(config) //Config(host = "localhost", port = 8080)
println(updatedConfig) //Config(host = "localhost", port = 8081)
`,
    },
    {
        id: 'type-safety',
        icon: DiamondIcon,
        title: 'Type-safety',
        description: `An explicit and expressive type system helps developers catch errors early:\n
- Strong type system clarifies intent, eases refactoring, and safeguards code evolution at scale.
- Reified generics keep type parameters at runtime, eliminating type erasure.
`,
        codeSample: `// Features like sealed classes, smart casts, and inline value classes 
// enforce exhaustive, compile-time checking of code paths;

@JvmInline value class UserId(val id: String)  // explicit type-safety for primitive types

sealed class Result
data class Found(val userId: UserId): Result()
data object NotFound: Result()

fun handle(res: Result): String = when(res) {  // exhaustive compile-time check
    is Found -> "User: \${res.userId.id}"  // smart-cast 'res' automatically
    NotFound -> "User not found"
}
`,
    },
];
