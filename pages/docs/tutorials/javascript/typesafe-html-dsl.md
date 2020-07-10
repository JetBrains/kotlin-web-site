---
type: tutorial
layout: tutorial
title:  "Typesafe HTML DSL"
description: "How to construct DOM elements using kotlinx.html and Kotlin DSLs."
authors: Sebastian Aigner
date: 2020-02-23
showAuthorInfo: false

---

The [kotlinx.html library](http://www.github.com/kotlin/kotlinx.html) provides the ability to generate DOM elements using statically typed HTML builders (and besides JavaScript, it is even available on the JVM target!) To use the library, we need to include the corresponding repository and dependency to our `build.gradle.kts` file:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
repositories {
    // ...
    jcenter()
}

dependencies {
    implementation(kotlin("stdlib-js"))
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.7.1")
    // ...
}
```
</div>

Once the dependency is included, we can access the different interfaces provided to generate our DOM. To render a headline, some text, and a link, the following snippet would be sufficient, for example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlin.browser.*
import kotlinx.html.*
import kotlinx.html.dom.*

fun main() {
    document.body!!.append.div {
        h1 {
            +"Welcome to Kotlin/JS!"
        }
        p {
            +"Fancy joining this year's "
            a("https://kotlinconf.com/") {
                +"KotlinConf"
            }
            +"?"
        }
    }
}
```
</div>

When running this example in the browser, the DOM will be assembled in a straightforward way. This is easily confirmed by checking the Elements of the website using the developer tools of our browser:

![Rendering a website from kotlinx.html]({{ url_for('tutorial_img', filename='javascript/typesafe-html-dsl/rendering-example.png')}})

To learn more about the `kotlinx.html` library, check out the [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started), where you can find more information about how to [create elements](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees) without adding them to the DOM, [binding to events](https://github.com/Kotlin/kotlinx.html/wiki/Events) like `onClick`, and examples on how to [apply CSS classes](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) to your HTML elements, to name just a few.