[//]: # (title: Browser and DOM API)

The [`kotlinx-browser`](https://github.com/Kotlin/kotlinx-browser) library lets you access browser-specific functionality.
It includes common top-level objects such as `document` and `window` and, where possible, provides typesafe wrappers
for their functionality.

As a fallback, the `dynamic` type provides access to functions that do not map well into the Kotlin type system.

To use the browser and DOM API, add the `kotlinx-browser` library as a dependency to your project's `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}

kotlin {
    js {
        browser()
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-browser:%kotlinxBrowserVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

kotlin {
    js {
        browser()
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-browser:%kotlinxBrowserVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

## Interaction with the DOM

For interaction with the Document Object Model (DOM), you can use the variable `document`. For example, you can set the
background color of our website through this object:

```kotlin
document.bgColor = "FFAA12" 
```

The `document` object also provides you a way to retrieve a specific element by ID, name, class name, tag name and so on.
All returned elements have the `Element?` type. To access their properties, you need to cast them to their appropriate type.
For example, assume that you have an HTML page with an email `<input>` field:

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

Note that your script is included at the bottom of the ``body`` tag. This ensures that the DOM is fully available before
the script is loaded.

With this setup, you can access elements of the DOM. To access the properties of the `input` field, invoke `getElementById`
and cast it to `HTMLInputElement`. You can then safely access its properties, such as `value`:

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

Much like you reference this `input` element, you can access other elements on the page, casting them to the appropriate
types.

## What's next?

To see how to create and structure elements in the DOM in a concise way, check out the [Typesafe HTML DSL](typesafe-html-dsl.md).