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
   
   inline fun 
   ```

2. Compile the library using the JS compiler

   ```
   $ kotlinc-js -output sample-library.js -meta-info library.kt
   ```

   The `-meta-info` option indicates that an additional js-file with binary
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
   
3. You can create archive, which can be distributed as a library:
   
   ```
   $ jar cf sample-library.jar *.js
   ```
   
   Or you can simply distribute two js-files, `sample-library.js` and `sample-library.meta.js`.
   Moreover, you can append the content of `sample-library.meta.js` to the end
   of `sample-library.js` and distribute only the resulting file.
   
### Using a Kotlin/JavaScript library.

   Create binom.kt:
   
``` kotlin
import org.sample.factorial
  
fun binom(m: Int, n: Int): Long =
        if (m < n) factorial(n) / factorial(m) / factorial(n-m) else 1    
```

   Compile with library:
   
```
   $ kotlinc-js -output binom.js -library-files sample-library.jar binom.kt
```

   If you have a pair of files, for example, `sample-library.js` and `sample-library.meta.js`,
   you can use the following command
   
```
   $ kotlinc-js -output binom.js -library-files sample-library.meta.js binom.kt
```
   
   Both files `sample-library.js` and `sample-library.meta.js` should be present in the latter case,
   though in this concrete case it is not important, in general case library can contain some inline functions,
   and translated javascript file will contain meta-information about inlining, which 
   is needed by compiler.
  
   
