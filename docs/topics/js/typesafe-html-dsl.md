[//]: # (title: Typesafe HTML DSL)

The [kotlinx.html library](http://www.github.com/kotlin/kotlinx.html) provides the ability to generate DOM elements using
statically typed HTML builders (and besides JavaScript, it is even available on the JVM target!) To use the library,
include the corresponding repository and dependency to our `build.gradle.kts` file:

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

Once the dependency is included, you can access the different interfaces provided to generate the DOM.
To render a headline, some text, and a link, the following snippet would be sufficient, for example:

```kotlin
import kotlinx.browser.*
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

When running this example in the browser, the DOM will be assembled in a straightforward way. This is easily confirmed
by checking the Elements of the website using the developer tools of our browser:

![Rendering a website from kotlinx.html](rendering-example.png)

To learn more about the `kotlinx.html` library, check out the [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started),
where you can find more information about how to [create elements](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)
without adding them to the DOM, [binding to events](https://github.com/Kotlin/kotlinx.html/wiki/Events) like `onClick`,
and examples on how to [apply CSS classes](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) to your HTML
elements, to name just a few.