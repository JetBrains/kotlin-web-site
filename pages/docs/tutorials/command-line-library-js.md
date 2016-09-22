---
type: tutorial
layout: tutorial
title: "Creating Kotlin/JavaScript library with the Command Line Compiler"
description: "This tutorial walks us through creating a Kotlin/JavaScript library using the command line compiler."
authors:
showAuthorInfo: false
related:
    - getting-started.md
---
### Creating a Kotlin/JavaScript library

We will create a simple Kotlin/JavaScript library.

1. Using our favorite editor, we create a new file called *library.kt*:

   ``` kotlin
   package org.sample
   
   fun factorial(n: Int): Long = if (n == 0) 1 else n * factorial(n - 1)
   
   inline fun IntRange.forOdd(f: (Int) -> Unit) {
       this.forEach { if (it % 2 == 1) f(it) }
   }
   ```

2. Compile the library using the JS compiler

   ```
   $ kotlinc-js -output sample-library.js -meta-info library.kt
   ```

   The `-meta-info` option indicates that an additional JS file with binary
   meta-information about compiled kotlin code will be created.
   
   If you want to see all available options run

   ```
   $ kotlinc-js -help
   ```
   
   After compilation we have two new files:

   ```
   sample-library.js
   sample-library.meta.js
   ```
   
3. You can simply distribute two JS files, `sample-library.js` and `sample-library.meta.js`.
   The former file contains translated JavaScript code, the latter file
   contains some meta-information about Kotlin code, which is needed by compiler.

   Alternatively, you can append the content of `sample-library.meta.js` to the end
   of `sample-library.js` and distribute only the resulting file.

   Also you can create an archive, which can be distributed as a library:  
   
   ```
   $ jar cf sample-library.jar *.js
   ```
   
### Using a Kotlin/JavaScript library.

   Create binom.kt:
   
``` kotlin
import org.sample.factorial
  
fun binom(m: Int, n: Int): Long =
    if (m < n) factorial(n) / factorial(m) / factorial(n-m) else 1
    
fun odd_factorial(n: Int): Long {
    var result: Long = 1L
    (1..n).forOdd { result = result * it }
    return result
}        
```

   Compile with library:

```
   $ kotlinc-js -output binom.js -library-files sample-library.meta.js binom.kt
```
   
   Both files `sample-library.js` and `sample-library.meta.js` should be present in the latter case,
   because translated JavaScript file contains meta-information about inlining, which 
   is needed by compiler.
   

   If you have an archive `sample-library.jar`, which contains `sample-library.js` and `sample-library.meta.js`,
   you can use the following command
   
```
   $ kotlinc-js -output binom.js -library-files sample-library.jar binom.kt
```
  
   
