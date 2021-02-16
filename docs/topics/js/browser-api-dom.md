[//]: # (title: Browser and DOM API)

The Kotlin/JS standard library lets you access browser-specific functionality using the `kotlinx.browser` package,
which includes typical top-level objects such as `document` and `window`. The standard library provides typesafe wrappers
for the functionality exposed by these objects wherever possible. As a fallback, the `dynamic` type is used to provide
interaction with functions that do not map well into the Kotlin type system.

## Interaction with the DOM

For interaction with the Document Object Model (DOM), you can use the variable `document`. For example, you can set the
background color of our website through this object:

```kotlin
document.bgColor = "FFAA12" 
```

The `document` object also provides you a way to retrieve a specific element by ID, name, class name, tag name and so on.
All returned elements are of type `Element?`. To access their properties, you need to cast them to their appropriate type.
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

To see how to create and structure elements in the DOM in a concise way, check out the [Typesafe HTML DSL](typesafe-html-dsl.md).