[//]: # (title: Kotlin/JS dead code elimination)

The Kotlin/JS Gradle plugin includes a _[dead code elimination](https://wikipedia.org/wiki/Dead_code_elimination)_ (_DCE_) tool.
Dead code elimination is often also called _tree shaking_. It reduces the size or the resulting JavaScript code by
removing unused properties, functions, and classes.

Unused declarations can appear in cases like:

* A function is inlined and never gets called directly (which happens always except for a few situations).
* A module uses a shared library. Without DCE, parts of the library that you don't use are still included in the resulting bundle.
  For example, the Kotlin standard library contains functions for manipulating lists, arrays, char sequences,
  adapters for DOM, and so on. All of this functionality would require about 1.3 MB as a JavaScript file. A simple 
  "Hello, world" application only requires console routines, which is only few kilobytes for the entire file.

The Kotlin/JS Gradle plugin handles DCE automatically when you build a **production bundle**, for example by using the
`browserProductionWebpack` task. **Development bundling** tasks (like `browserDevelopmentWebpack`) don't include DCE.

## Exclude declarations from DCE

Sometimes you may need to keep a function or a class in the resulting JavaScript code even if you don't use it in your module,
for example, if you're going to use it in the client JavaScript code.

To keep certain declarations from elimination, add the `dceTask` block to your Gradle build script and
list the declarations as arguments of the `keep` function. An argument must be the declaration's fully qualified name
with the module name as a prefix: `moduleName.dot.separated.package.name.declarationName`

> Unless specified otherwise, the names of functions and modules can be [mangled](js-to-kotlin-interop.md#jsname-annotation)
>in the generated JavaScript code. To keep such functions from elimination, use the mangled names in the `keep` arguments
>as they appear in the generated JavaScript code.
>
{type="note"}

```groovy
kotlin {
    js {
        browser {
            dceTask {
                keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
            }
            binaries.executable()
        }
    }
}
```

If you want to keep a whole package or module from elimination, you can use its fully qualified name as it appears in the
generated JavaScript code.

> Keeping whole packages or modules from elimination can prevent DCE from removing many unused declarations. Because of
> this, it is preferable to select individual declarations which should be excluded from DCE one by one.
>
{type="note"}

## Disable DCE

To turn off DCE completely, use the `devMode` option in the `dceTask`:

```groovy
kotlin {
    js {
        browser {
            dceTask {
                dceOptions.devMode = true
            }
        }
        binaries.executable()
    }
}
```