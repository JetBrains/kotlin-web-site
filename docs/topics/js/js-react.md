[//]: # (title: Build a web application with React and Kotlin/JS — tutorial)

This tutorial will teach you how to build a browser application with Kotlin/JS and the [React](https://reactjs.org/)
framework using the Gradle plugin. You will:

* Complete usual kinds of tasks associated with building a typical React application
* Explore how domain-specific languages can be used to help express concepts concisely and uniformly without sacrificing
readability, allowing to write a fully-fledged application completely in Kotlin
* Learn how to use ready-made components created by the community, use external libraries, and publish the final application

The output will be a website *KotlinConf Explorer* with an overview of the [KotlinConf](https://kotlinconf.com/) event
with links to talks, which users can mark as seen or unseen and watch them all on one page.

The tutorial assumes you have prior knowledge of Kotlin and basic knowledge of HTML and CSS. Understanding the basic
concepts behind React may help understand some of the sample code but is not strictly required.

> You can get the final application as well as the intermediate steps [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle).
> Each step is available from its own branch, and is linked at the bottom of each corresponding section.
>
{type="note"}

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).
2. Clone the [project template](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle) and open it in IntelliJ
IDEA. The template includes a basic Kotlin/JS Gradle project with all required configurations and dependencies:

* Dependencies and tasks in the Gradle file:

```kotlin
dependencies {

    //React, React DOM + Wrappers
    implementation("org.jetbrains:kotlin-react:17.0.2-pre.154-kotlin-1.5.0")
    implementation("org.jetbrains:kotlin-react-dom:17.0.2-pre.154-kotlin-1.5.0")
    implementation(npm("react", "17.0.2"))
    implementation(npm("react-dom", "17.0.2"))

    //Kotlin Styled
    implementation("org.jetbrains:kotlin-styled:5.2.3-pre.154-kotlin-1.5.0")
    implementation(npm("styled-components", "~5.2.3"))

    //Video Player
    implementation(npm("react-youtube-lite", "1.0.1"))

    //Share Buttons
    implementation(npm("react-share", "~4.2.1"))

    //Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.0-RC")
}
```

* An HTML page in `/src/main/resources/index.html` to insert HTML code:

```xml
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello, Kotlin/JS!</title>
</head>
<body>
    <div id="root"></div>
    <script src="confexplorer.js"></script>
</body>
</html>
```

The Kotlin/JS Gradle plugin will bundle all of your code and its dependencies into a single JavaScript file, which has
the same name as the project: `confexplorer.js`. As a typical [JavaScript convention](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents),
the content of the body (including the `root` div) is loaded first to ensure that the browser loads all page elements
before the scripts. See the following code snippet in `src/main/kotlin/Main.kt`:

```kotlin
import kotlinx.browser.document

fun main() {
   document.bgColor = "red"
}
```

### Test the development server

The `kotlin.js` Gradle plugin comes by default with support for an embedded `webpack-dev-server`, allowing to run
the application from the IDE without manually setting up any kind of server. To test that the program is reaching
the browser and executes, start the development server by invoking the `run` or `browserDevelopmentRun` (available in
the `other` or `kotlin browser` directory) task from the Gradle tool window inside IntelliJ IDEA:

![Gradle tasks list](browser-development-run.png){width=700}

To run the program from the Terminal, use `./gradlew run` instead.
When the project is compiled and bundled, a red, blank page will appear in a browser window:

![Blank red page](red-page.png){width=700}

### Enable hot reload / continuous mode

Instead of manually compiling and executing your project every time the changes are made, configure the continuous
compilation mode. Make sure to stop all running development server instances before proceeding.

Edit a run configuration that IntelliJ IDEA automatically generates after running the Gradle `run` task for the first time:

![Edit a run configuration](edit-configurations.png){width=700}

1. In the **Run/Debug Configurations** dialog, add the `--continuous` flag to the arguments for the run configuration:

![Enable continuous mode](continuous-mode.png){width=700}

   After applying the changes, you can use the play button inside IntelliJ IDEA to start the development server back up.
   To run the Gradle continuous builds from the Terminal, use `./gradlew run --continuous` instead.

2. To test this feature, change the color of the page to blue in the `Main.kt` file while the Gradle task is running:

   ```kotlin
   document.bgColor = "blue"
   ```

   The project will be recompiled, and the browser page will reflect the new hue after the reload.

During the development, you can leave the development server running. It will automatically recompile and reload the page
while it is running when you make some changes.

> You can find the state of the project after this section on the `master` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master).
>
{type="note"}

## Create the first static page with React

Change the code in the `Main.kt` file as follows:

```kotlin
import react.dom.*
import kotlinx.browser.document

fun main() {
    render(document.getElementById("root")) {
        h1 {
            +"Hello, React+Kotlin/JS!"
        }
    }
}
```

When the project is recompiled, an HTML page in your browser should display:

![An HTML page example](hello-react-js.png){width=700}

* The `render()` function instructs [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom)
to render out a component into an element in the website. If you go back to the /src/main/resources/index.html, you can
see a container element called `root`, into which the content is rendered. The content is pretty simple and uses
a typesafe DSL to render HTML.
* `h1` is a function that takes a lambda parameter. When you add the `+` sign in front of the string literal,
the `unaryPlus()` function is actually invoked using [operator overloading](https://kotlinlang.org/docs/reference/operator-overloading.html).
It appends the string to the enclosed HTML element.

## Create a website draft with Kotlin code instead of HTML

Kotlin's support for Domain Specific Languages (DSLs), a feature provided through [kotlin-react](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md),
helps to describe a markup language like HTML using a syntax that is easy to read for those familiar with HTML.
Compare classic HTML code for the future website and its typesafe variant in Kotlin:

<tabs>
<tab>

```kotlin
h1 {
    +"KotlinConf Explorer"
}
div {
    h3 {
        +"Videos to watch"
    }
    p {
        +"John Doe: Building and breaking things"
    }
    p {
        +"Jane Smith: The development process"
    }
    p {
        +"Matt Miller: The Web 7.0"
    }

    h3 {
        +"Videos watched"
    }
    p {
        +"Tom Jerry: Mouseless development"
    }
}
div {
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
        attrs {
            src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
        }
    }
}
```

</tab>
<tab>

```xml
<h1>KotlinConf Explorer</h1>
<div>
    <h3>Videos to watch</h3>
    <p>John Doe: Building and breaking things</p>
    <p>Jane Smith: The development process</p>
    <p>Matt Miller: The Web 7.0</p>
    <h3>Videos watched</h3>
    <p>Tom Jerry: Mouseless development</p>
</div>
<div>
    <h3>John Doe: Building and breaking things</h3>
    <img src="https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder">
</div>
```

</tab>
</tabs>

Type or paste the above Kotlin code as the contents of your `render()` call. If IntelliJ IDEA complains about missing
imports, invoke the corresponding quick fixes using **Alt+Enter**.

Wait for the browser to reload. The page should now look like this:

![The website draft](website-draft.png){width=700}

### Add videos using Kotlin constructs in markup

Now, add the list of videos as a list of Kotlin objects:

1. Create a simple data class called `KotlinVideo` to hold together the attributes of a video. You can add it in `Main.kt`
or any other file.
2. Define a corresponding external interface, which will be useful for getting data from a real API:

    ```kotlin
    external interface Video {
        val id: Int
        val title: String
        val speaker: String
        val videoUrl: String
    }
    
    data class KotlinVideo(
        override val id: Int,
        override val title: String,
        override val speaker: String,
        override val videoUrl: String
    ) : Video
    ```
   
3. Fill up the two lists for unwatched videos and watched videos, respectively. For now, add these declarations at
file-level in `Main.kt`:

   ```kotlin
   val unwatchedVideos = listOf(
      KotlinVideo(1, "Building and breaking things", "John Doe", "https://youtu.be/PsaFVLr8t4E"),
      KotlinVideo(2, "The development process", "Jane Smith", "https://youtu.be/PsaFVLr8t4E"),
      KotlinVideo(3, "The Web 7.0", "Matt Miller", "https://youtu.be/PsaFVLr8t4E")
   )
   
   val watchedVideos = listOf(
      KotlinVideo(4, "Mouseless development", "Tom Jerry", "https://youtu.be/PsaFVLr8t4E")
   )
   ```

4. To pull this information back into HTML, write a loop in your Kotlin code to iterate over the collection items and add
an HTML element for each of them:

   ```kotlin
   for(video in unwatchedVideos) {
      p {
          +"${video.speaker}: ${video.title}"
      }
   }
   ```

You can use the same process to modify the code for the `watchedVideos`. Wait for the browser to reload. You should see
that this change is rendering the equivalent list as above.

### Add styles with typesafe CSS

[kotlin-styled](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-styled) provides typesafe wrappers for
[styled-components](https://www.styled-components.com/) allowing to quickly and safely define styles [globally](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-styled/README.md#global-styles)
or for individual elements of the DOM. It wraps the styled-components library and allows building constructs that look like [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js).

You don't need to perform any extra steps to start using this functionality because there already are necessary
dependencies in your Gradle configuration:

```kotlin
dependencies {
    //...
    //Kotlin Styled
    implementation("org.jetbrains:kotlin-styled:5.2.1-pre.148-kotlin-1.4.21")
    implementation(npm("styled-components", "~5.2.1"))
    //...
}
```

Instead of writing out HTML elements like `div` or `h3`, you can use their `styled` counterparts, `styledDiv` or `styledH3`,
making it possible to specify CSS styles in the body. For example, to move the video player to the top right corner of the page,
adjust the code to look like this:

```kotlin
styledDiv {
    css {
        position = Position.absolute
        top = 10.px
        right = 10.px
    }
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
        attrs {
            src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
        }
    }
}
```

IntelliJ IDEA will complain about unresolved references. Use quick-fixes via **Alt-Enter** or add necessary imports to
the top of the file:

```kotlin
import kotlinx.css.*
import styled.*
```

You can try making the headline use a `fontFamily` that is `sans-serif`, for example, or define some more beautiful `color`s
in your code.

> You can find the state of the project after this section on the `step-02-first-static-page` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/step-02-first-static-page).
>
{type="note"}

## Add the first component

The basic building blocks in React are called components. You build your application by combining these components, which
can also be composed of other smaller components. By structuring the components for reusability and keeping them generic,
you'll be able to use them in multiple parts of the application without duplicating code or logic.

The `root` node that is currently rendering is already a React component. The current layout of your application looks
like this:

![Current layout](current-layout.png){width=700}

If you structure the application and split it up into components, you'll end up with a more structured layout, in which
each component handles its responsibilities:

![Structured layout with componants](structured-layout.png){width=700}

Creating components that encapsulate a particular functionality shortens source code and makes it easier to read and
understand.

### Structure your application

First, explicitly specify the main component for rendering into the `root` element, the `App`:

1. Create a new file in the `src/main/kotlin` folder called `App.kt`.
2. Inside this file, create the `App` class, which inherits from `RComponent`, a React Component. For now, keep its generic
default parameters (`RProps` and `RState`).
3. Move all typesafe HTML into the `render()` function. Now all HTML is in its explicit component:

   ```kotlin
   import react.*
   
   @JsExport
   class App : RComponent<RProps, RState>() {
     override fun RBuilder.render() {
           // typesafe HTML goes here!
       }
   }
   ```

4. In the `Main.kt` file, update the `main()` function. It should reference `App` instead of rendering its own HTML. Specify
that the `App` component should be rendered as a `child` of the `root` object:

   ```kotlin
   fun main() {
       render(document.getElementById("root")) {
           child(App::class) {}
       }
   }
   ```

For more information on how React and its components operate, see its [documentation and guides](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide).

### Extract a list component

Since the `watchedVideos` and `unwatchedVideos` lists both display a list of videos, it makes sense to create a single
reusable component.

Create a new file called `VideoList.kt`. The `VideoList` class follows the same pattern as the `App` class from before,
inheriting from `RComponent`, and containing the code from the `unwatchedVideos` list.

```kotlin
import react.*
import react.dom.*

@JsExport
class VideoList: RComponent<RProps, RState>() {
    override fun RBuilder.render() {
        for (video in unwatchedVideos) {
            p {
                +"${video.speaker}: ${video.title}"
            }
        }
    }
}
```

The video-list part of `App` should look like this:

```kotlin
div {
    h3 {
        +"Videos to watch"
    }
    child(VideoList::class) {}

    h3 {
        +"Videos watched"
    }
    child(VideoList::class) {}
}
```

### Add props

To reuse the list, it should be possible to fill it with different content. So instead of having the list of items
stored inside the component's class, it should be controlled externally and passed in as an attribute for the component.
In React, these attributes are called props. If props change in React, the framework will render the page. Add a prop that
contains the list of talks:

1. Within `VideoList.kt`, add an interface definition:

   ```kotlin
   external interface VideoListProps: RProps {
       var videos: List<Video>
   }
   ```

2. Adjust the class definition of `VideoList` to make use of those props:

   ```kotlin
   @JsExport
   class VideoList: RComponent<VideoListProps, RState>() {
       override fun RBuilder.render() {
           for (video in props.videos) {
               p {
                   key = video.id.toString()
                   +"${video.speaker}: ${video.title}"
               }
           }
       }
   }
   ```

   Because the content of lists is now potentially dynamic (i.e., during runtime, the attributes passed into your component
might change), you also need to add a key attribute. This helps the React renderer figure out which parts of the list need
to refresh and which ones can stay the same.

   You can find more information about lists and keys in the [React guide](https://reactjs.org/docs/lists-and-keys.html).
3. Now, at the usage site within `App`, make sure that the child components are instantiated with proper attributes.
Replace the two loops underneath the `h3` elements with the respective attributes for `unwatchedVideos` and `watchedVideos`:

   ```kotlin
   child(VideoList::class) {
       attrs.videos = unwatchedVideos
   }
   ```

The browser reload will show that the lists now render as they are supposed to.

### Simplify your code

You can use [lambdas with receivers](https://kotlinlang.org/docs/reference/lambdas.html#function-literals-with-receiver)
to make the usage site of the component nicer:

```kotlin
fun RBuilder.videoList(handler: VideoListProps.() -> Unit): ReactElement {
    return child(VideoList::class) {
        this.attrs(handler)
    }
}
```

* The code above defines a function called `videoList()` as an [extension function](https://kotlinlang.org/docs/reference/extensions.html)
on `RBuilder`.
* The function takes one parameter (`handler`), an extension function on `VideoListProps` returning `Unit`.
* This function wraps the call to the child (same as before) and passes the handler to instantiate the `attrs`.

Therefore, the usage site can be further simplified:

```kotlin
videoList {
    videos = unwatchedVideos
}
```

### Make it interactive

The final goal for the list component is to have it control the video that's currently being played in the video player.
For that, the list first needs to allow the user to interact with its elements. To start, add `alert` to the video object
the user has selected.

To do this, modify the code inside the `VideoList()` render function inside the loop to include a handler that alerts
the current element:

```kotlin
p {
    key = video.id.toString()
    attrs {
        onClickFunction = {
            window.alert("Clicked $video!")
        }
    }
    +"${video.speaker}: ${video.title}"
}
```

When IntelliJ IDEA prompts you to add imports for this functionality, use the **Alt+Enter** quick fixes.
Alternatively, you can add the required imports manually:

```kotlin
import kotlinx.html.js.onClickFunction
import kotlinx.browser.window
```

Now, if you click on one of the list items in the browser window, you'll get the following information inside an `alert`
window:

![Browser alert window](alert-window.png){width=700}

> Defining an `onClickFunction()` directly as lambda is concise and very useful for prototyping. However, the way equality
> [currently works](https://youtrack.jetbrains.com/issue/KT-15101) in Kotlin/JS is not the most performance-optimized way
> of passing click handlers. If you want to optimize rendering performance, consider storing your functions in a variable
> and passing them.
>

### Add state

Instead of alerting the user, you can add a ▶ triangle to highlight the selected video. To do that, introduce some
state-specific to this component — define an interface, just as you did with props:

```kotlin
external interface VideoListState: RState {
    var selectedVideo: Video?
}
```

Adjust the class definition of `VideoList` to use the `VideoListState` – specifically, make inherit from
an `RComponent<..., VideoListState>`. Prepend a triangle string for the currently selected element of the list. Modify
the `onClickFunction()` to set the contents of `selectedVideo` to be equal to the element in your list. To ensure
that components are re-rendered when changing `state`, wrap the variable update in the `setState` lambda.

```kotlin
@JsExport
class VideoList : RComponent<VideoListProps, VideoListState>() {
    override fun RBuilder.render() {
        for (video in props.videos) {
            p {
                key = video.id.toString()
                attrs {
                    onClickFunction = {
                        setState {
                            selectedVideo = video
                        }
                    }
                }
                if (video == state.selectedVideo) {
                    +"▶ "
                }
                +"${video.speaker}: ${video.title}"
            }
        }
    }
}
```

> State should only ever be modified from within the `setState` lambda. This allows the React renderer to detect any
> state changes and re-render portions of the UI quickly and efficiently.
>
{type="warning"}

You can find more details about states in the [React FAQ](https://reactjs.org/docs/faq-state.html).

> You can find the state of the project after this section on the `step-03-first-component` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/step-03-first-component).
>
{type="note"}

## Compose components

Currently, two video lists work on their own. It means that users can select two videos both in the unwatched and watched
videos lists, even there's only one player:

![Two videos are selected in both lists simultaniously](two-videos-select.png){width=700}

It happens because both lists share some overarching state: the selected video, as there can only be one selected video
application-wide. However, this shared state can't (and shouldn't be) stored within the individual components but lifted out.

### Lift state

To prevent components from being hard-wired together, React props are always passed in from the parent component,
enforcing a proper hierarchy. If different components want to change the state of their sibling components, they can only
do it through their parent. At that point, the state is no longer that of a sibling component but of the parent component.
The process of migrating states from components to their parents is called lifting state.

To lift the state, add the state to the `App` component. The process is similar to the one with `VideoList`:

1. Define an interface:

    ```kotlin
    external interface AppState : RState {
        var currentVideo: Video?
    }
    ```

2. Make sure to use this interface in the `App` class:

    ```kotlin
    @JsExport
    class App : RComponent<RProps, AppState>()
    ```
   
3. Delete the `VideoListState` since it is stored somewhere further up the hierarchy now. 
4. At this point, the list is effectively stateless since all of the state was moved out of the component. Revert
the list class definition to inherit the default state:

    ```kotlin
    @JsExport
    class VideoList : RComponent<VideoListProps, RState>()
    ```

5. Expand the `VideoListProps` interface to contain the `selectedVideo`. It's necessary to pass down the overarching
state using a prop:

   ```kotlin
   external interface VideoListProps : RProps {
       var videos: List<Video>
       var selectedVideo: Video?
   }
   ```

6. Fix the condition for the triangle highlight to use `props` instead of `state`:

   ```kotlin
   if(video == props.selectedVideo) {
       +"▶ "
   }
   ```

### Pass handlers

Now there's no access to the parent component's state, so the setState lambda for the `onClickFunction()` doesn't
actually work. To fix this and get the app running, you need the state lifting again.

Altering the state of the parent component is not allowed in React. To solve the problem of modifying the application
state from within a component, you can move the logic for handling user interaction into a prop and passing it in from
the parent. Remember that in Kotlin, variables can have the [type of a function](https://kotlinlang.org/docs/reference/lambdas.html#function-types).

1. Expand the `VideoListProps interface` so that it contains a variable `onSelectVideo()`, which is a function from
`Video` returning `Unit`:

   ```kotlin
   external interface VideoListProps : RProps {
       var videos: List<Video>
       var selectedVideo: Video?
       var onSelectVideo: (Video) -> Unit
   }
   ```

2. Adjust `onClickFunction()` accordingly to use the prop:

   ```kotlin
   onClickFunction = {
       props.onSelectVideo(video)
   }
   ```

3. Now, you can pass in the selected video as a prop, and move the logic for selecting a video into the parent component,
where modifying the state is allowed. Add the corresponding logic within two `videoList` usages:

    ```kotlin
    videoList {
        videos = unwatchedVideos
        selectedVideo = state.currentVideo
        onSelectVideo = { video ->
            setState {
                currentVideo = video
            }
        }
    }
    ```

4. Repeat this step for the watched videos list.
5. Switch back to your browser and check that the selection jumps between the lists when selecting a video in the two
lists instead of being duplicated.

> You can find the state of the project after this section on the `step-04-composing-components` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/step-04-composing-components).
>
{type="note"}

## Add more components

### Extract the video player component

You can now create another self-contained unit, a video player, that is currently visualized by a placeholder image. The
props for the video player, like author, talk title, and video link need to be passed to the `VideoPlayer` component.
This information is already contained within a `Video` object, so you can pass it as a prop and use its attributes accordingly. 

If you write the whole component, including its respective interfaces, you should end up with a file called `VideoPlayer.kt`
that contains the following:

```kotlin
import kotlinx.css.*
import kotlinx.html.js.onClickFunction
import react.*
import react.dom.*
import styled.*

external interface VideoPlayerProps : RProps {
    var video: Video
}

@JsExport
class VideoPlayer : RComponent<VideoPlayerProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                position = Position.absolute
                top = 10.px
                right = 10.px
            }
            h3 {
                +"${props.video.speaker}: ${props.video.title}"
            }
            img {
                attrs {
                    src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
                }
            }
        }
    }
}

fun RBuilder.videoPlayer(handler: VideoPlayerProps.() -> Unit): ReactElement {
    return child(VideoPlayer::class) {
        this.attrs(handler)
    }
}
```

In `App.kt`, replace the previous snippet, `styledDiv` that contained the video player, with the following:

```kotlin
state.currentVideo?.let { currentVideo ->
    videoPlayer {
        video = currentVideo
    }
}
```

Now the video player will only be shown if the `currentVideo` in the application's state is set.

### Add a button and wire it

To make it possible for users to move videos from the list of unwatched videos to the list of watched videos (and vice versa),
add a button to the `VideoPlayer` component.

Since moving items between two different lists happens outside the `VideoPlayer` component, the handler for the button
needs to be lifted and passed in from the outside. The button should have different text depending on whether the video
has been watched or not. So you need to give the button the status of the video passed in:

1. Expand the `VideoPlayerProps` interface:

    ```kotlin
    external interface VideoPlayerProps : RProps {
        var video: Video
        var onWatchedButtonPressed: (Video) -> Unit
        var unwatchedVideo: Boolean
    }
    ```

2. You can use props to adjust CSS properties. In this case, the color of the button is dynamically based on
the state of the video. Add the following HTML DSL snippet to the `render()` function of `VideoPlayer`, between the `h3`
and `img` tags:

    ```kotlin
    styledButton {
        css {
            display = Display.block
            backgroundColor = if(props.unwatchedVideo) Color.lightGreen else Color.red
        }
        attrs {
            onClickFunction = {
                props.onWatchedButtonPressed(props.video)
            }
        }
        if(props.unwatchedVideo) {
            +"Mark as watched"
        }
        else {
            +"Mark as unwatched"
        }
    }
    ```

### Move video lists to the application state

Now it's time to adjust the usage site for the `VideoPlayer`. When the button is clicked, a video should either be moved
from the unwatched list to the watched list or vice versa. Since these lists can now actually change, move them into
the application state:

1. Expand the interface with a couple more lines:

    ```kotlin
    external interface AppState : RState {
        var currentVideo: Video?
        var unwatchedVideos: List<Video>
        var watchedVideos: List<Video>
    }
    ```

2. Fill the state with some predefined values from within the `init()` function. To do that, add an override to
the body of the `App` class:

    ```kotlin
    override fun AppState.init() {
        unwatchedVideos = listOf(
            KotlinVideo(1, "Building and breaking things", "John Doe", "https://youtu.be/PsaFVLr8t4E"),
            KotlinVideo(2, "The development process", "Jane Smith", "https://youtu.be/PsaFVLr8t4E"),
            KotlinVideo(3, "The Web 7.0", "Matt Miller", "https://youtu.be/PsaFVLr8t4E")
        )
        watchedVideos = listOf(
            KotlinVideo(4, "Mouseless development", "Tom Jerry", "https://youtu.be/PsaFVLr8t4E")
        )
    }
    ```

3. Now you can delete the original file-level declarations for `unwatchedVideos` and `watchedVideos` in `Main.kt`.
Follow the compiler errors to replace all references to (`un`)`watchedVideos` in the `videoList` invocations and replace
them with `state.`(`un`)`watchedVideos` inside `App.kt`.

   The `videoPlayer` call site should look like this:
    
   ```kotlin
    videoPlayer {
        video = currentVideo
        unwatchedVideo = currentVideo in state.unwatchedVideos
        onWatchedButtonPressed = {
            if (video in state.unwatchedVideos) {
                setState {
                    unwatchedVideos -= video
                    watchedVideos += video
                }
            } else {
                setState {
                    watchedVideos -= video
                    unwatchedVideos += video
                }
            }
        }
    }
    ```
   
4. Check your browser, select a video, and hit the button a few times. The element should switch between the two lists.

Feel free to change the styles for the button, adjust it, and maybe try extracting the button as its own reusable component.

> You can find the state of the project after this section on the `step-05-more-components` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/step-05-more-components).
>
{type="note"}

## Use packages from NPM

To make the app work, you still need a video player. React has a rich ecosystem with a lot of ready-made components you
can use instead of writing everything from scratch yourself.

### Add the video player component

To replace the placeholder video component with one that can show the linked YouTube videos, add in a ready-made video
player for React. For example, the `react-youtube-lite` component that can show video and control the appearance of the
player.

For the component documentation and the API description, see its [README](https://www.npmjs.com/package/react-youtube-lite)
in GitHub.

1. Check the `build.gradle(.kts)` file. In the beginning, you've already added the `react-youtube-lite` package:

    ```kotlin
    dependencies {
        //...
        //Video Player
        implementation(npm("react-youtube-lite", "1.0.1"))
        //...
    }
    ```

   As you can see, NPM dependencies can be added to a Gradle build file via the `npm()` function. The yarn installation
managed by the Gradle plugin will take care of downloading, installing and updating those NPM dependencies for you.

2. To use this module from Kotlin, create a file called `ReactYouTube.kt`, with the following contents:

    ```kotlin
    @file:JsModule("react-youtube-lite")
    @file:JsNonModule
    
    import react.*
    
    @JsName("ReactYouTubeLite")
    external val reactPlayer: RClass<dynamic>
    ```

   It's necessary to tell the compiler about the component interface, what can be invoked, set, or read from this external
   component so that everything's safe, and you can count on tool support.
   The last two lines are equivalent to a JavaScript import like `require("react-youtube-lite").default;`. It tells
   the compiler that it's certain that there'll be a component conforming to `RClass<dynamic>` at runtime. 

However, in this configuration, the declaration of dynamic instructs the compiler to accept the component as is at
the risk of breaking things at runtime (in production).

You can infer the structure of the interfaces used by the imported components from the [README](https://www.npmjs.com/package/react-youtube-lite)
to make wrappers typesafe. Define a typesafe external interface allowing to set the URL as needed: 

1. Modify the `ReactPlayer` definition to:

   ```kotlin
   @file:JsModule("react-youtube-lite")
   @file:JsNonModule
   
   import react.*
   
   @JsName("ReactYouTubeLite")
   external val reactPlayer: RClass<ReactYouTubeProps>
   
   external interface ReactYouTubeProps : RProps {
       var url: String
   }
   ```

2. Within the `VideoPlayer` class, replace the `img` tag with:

   ```kotlin
   reactPlayer {
       attrs.url = props.video.videoUrl
   }
   ```

### Add social share buttons

An easy way to share the content in the application is to have social share buttons for messengers and email. You can use
an off-the-shelf React component for this as well, for example, [react-share](https://github.com/nygardk/react-share/blob/master/README.md).

1. Check your Gradle configuration. For this package, there's already a corresponding snippet:
    
   ```kotlin
    dependencies {
        //...
        //Share Buttons
        implementation(npm("react-share", "~4.2.1"))
        //...
    }
    ```
   
2. [Examples on GitHub](https://github.com/nygardk/react-share/blob/master/demo/Demo.jsx#L61) show that a share button
consists of two react components: `EmailShareButton` and `EmailIcon`, for example. However, all of them share (mostly)
the same interface.
   If you add more wrappers, your `ReactShare.kt` declaration will look like this:

    ```kotlin
    @file:JsModule("react-share")
    @file:JsNonModule
    
    import react.RClass
    import react.RProps
    
    @JsName("EmailIcon")
    external val emailIcon: RClass<IconProps>
    
    @JsName("EmailShareButton")
    external val emailShareButton: RClass<ShareButtonProps>
    
    @JsName("TelegramIcon")
    external val telegramIcon: RClass<IconProps>
    
    @JsName("TelegramShareButton")
    external val telegramShareButton: RClass<ShareButtonProps>
    
    external interface ShareButtonProps : RProps {
        var url: String
    }
    
    external interface IconProps : RProps {
        var size: Int
        var round: Boolean
    }
    ```
   
3. Above the `reactPlayer` usage site in `VideoPlayer.kt`, add the two share buttons (in a `styledDiv` for a layout):

   ```kotlin
   styledDiv {
       css {
           display = Display.flex
           marginBottom = 10.px
       }
       emailShareButton {
           attrs.url = props.video.videoUrl
           emailIcon {
               attrs.size = 32
               attrs.round = true
           }
       }
       telegramShareButton {
           attrs.url = props.video.videoUrl
           telegramIcon {
               attrs.size = 32
               attrs.round = true
           }
       }
   }
   ```

You can now check that the buttons actually work by clicking one of them and seeing if the corresponding share window opens.
If you don't see anything, you may need to disable your social / ad blocker for it to work.

![Share window](social-buttons.png)

Feel free to repeat this step with some of the other share buttons [offered by the component](https://github.com/nygardk/react-share/blob/master/README.md#features).

> You can find the state of the project after this section on the `step-06-packages-from-npm` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/step-06-packages-from-npm).
>
{type="note"}

## Use an external REST API

You can substitute mock data by obtaining information from a REST API to display the videos and render your application.

For this tutorial, there's a [small API](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1).
It offers only a single endpoint, `videos`, and takes a numeric parameter to access an element from the list. Feel free
to try out this rather limited API in the browser. You will see that the objects returned from the API follow the same
structure as `Video` objects.

### Use JS functionality from Kotlin

Even without pulling in external libraries, browsers already come with a lot of functionality. Wrappers for those APIs
are included with Kotlin/JS. They make it easy to access the available functionality in a comfortable and type-safe way
straight from your Kotlin code. One example of these wrappers is the functionality for consuming making HTTP requests
(arguably the most important part in consuming a RESTful service), in particular, the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

The typical way to do asynchronous programming in JavaScript is through the use of callbacks. This means resolving promises
step by step using functions stacked inside of other functions. The more complex your code gets, the more heavily indented
it will be. This approach makes the code harder to parse and to understand the control flow.

Instead, you can use Kotlin coroutines, a much nicer and more structured way for such functionality.

### Make use of coroutines instead of callbacks

1. Check the `build.gradle(.kts)` file. The relevant snippet should already exist in your configuration from back
when you set up the project:

   ```kotlin
   dependencies {
       //...
       //Coroutines
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.9")
   }
   ```

2. Inside `App.kt` (or a new file), write a method to fetch a video from the API:

   ```kotlin
   suspend fun fetchVideo(id: Int): Video {
       val response = window
           .fetch("https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/$id")
           .await()
           .json()
           .await()
       return response as Video
   }
   ```
   
Suspending function fetches a video from the API given an `id`, waits for it to be available, turns it into a JSON,
waits again for the completion of that operation, and returns it – but before, it casts it to the external interface
`Video`, which was defined earlier.

You will see a warning for this unchecked cast – but this is in the nature of using a JavaScript definition like `fetch` —
the compiler can't know for sure that an instance of `Video` is returned. Use quick fixes to import the required objects
and functions, or manually add them to the top of `App.kt`:

```kotlin
import kotlinx.browser.window
import kotlinx.coroutines.*
```

A function call like `window.fetch` returns a `Promise` object. You would have to define a callback handler that gets
invoked once the `Promise` is resolved and a result is available.

However, with coroutines, you can `await` those promises. Whenever a function like `await()` is called, the method stops
(suspends) its execution. It continues execution once the `Promise` can be resolved.

To work with multiple lists of videos, you can define a function `fetchVideos()`, which will fetch 25 videos from the
same API as above. To run all the requests concurrently, use the `async` functionality provided by coroutines:

```kotlin
suspend fun fetchVideos(): List<Video> = coroutineScope {
    (1..25).map { id ->
        async {
            fetchVideo(id)
        }
    }.awaitAll()
}
```

For reasons of [structured concurrency](https://kotlinlang.org/docs/reference/coroutines/basics.html#structured-concurrency),
the implementation is wrapped in a coroutineScope. You can then start 25 asynchronous tasks (one per request) and wait
for them to complete.

You can now add the data to your application. To do this, expand the `init()` function of `App`:

```kotlin
override fun AppState.init() {
    unwatchedVideos = listOf()
    watchedVideos = listOf()

    val mainScope = MainScope()
    mainScope.launch {
        val videos = fetchVideos()
        setState {
            unwatchedVideos = videos
        }
    }
}
```

> Inside the `init()` function, `setState` is used to set the unwatchedVideos to the result of the coroutine. The `setState`
> invocation is necessary to refresh the rendered result, as the app has most likely already finished rendering an empty
> list of `unwatchedVideos`.
>
{type="note"}

Check your browser. The application should show actual data:

![Fetched data from API](website-api-data.png){width=700}

If you want to get an in-depth understanding of how coroutines work, check this [hands-on on coroutines](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/).

> You can find the state of the project after this section on the `step-07-using-external-rest-api` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/step-07-using-external-rest-api).
>
{type="note"}

## Deploy to production and the cloud

It's time to get the application published to the cloud and make it accessible for other people.

### Package a production build

To package all assets in production mode, run the `build` task in Gradle via the tool window in IntelliJ IDEA or by
running `./gradlew build`.

This generates an optimized build of your project, applying various improvements such as DCE (dead code elimination).
Several static files ready for deployment will appear inside the `/build/distributions` folder. They include the JS files,
HTML files, and other resources required to run the application. You can put them on a static HTTP server, serve them
using GitHub Pages, or host them on a cloud provider of your choice.

### Deploy to Heroku

Heroku makes it quite simple to spin up an application that is reachable under its own domain. Their free tier should be
enough for development purposes.

1. [Create an account](https://signup.heroku.com/).
2. [Install and authenticate the CLI client](https://devcenter.heroku.com/articles/heroku-cli).
3. Create a git repository and attach a Heroku app by running the following commands in the Terminal while in the project root:

   ```bash
   git init
   heroku create
   git add .
   git commit -m "initial commit"
   ```
   
4. Unlike a regular JVM application that would run on Heroku (for example, written with Ktor or Spring Boot), your app
generates static HTML pages and JS files that need to be served accordingly. You can adjust the required buildpacks to
serve the program properly:
   
   ```bash
   heroku buildpacks:set heroku/gradle
   heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
   ```
   
5. To allow the `heroku/gradle` buildpack to run properly, a `stage` task needs to be present in the Gradle build file. It's
equivalent to the `build` task, and the corresponding alias is already included at the bottom of the Gradle build file:

   ```kotlin
   // Heroku Deployment
   tasks.register("stage") {
       dependsOn("build")
   }
   ```

6. Configure the `buildpack-static` by adding a file called `static.json` to the root of the project. Add the `root` property
inside the file as follows:

```xml
{
    "root": "build/distributions"
}
```

7. You can now trigger a deployment, for example, by running the following command:

   ```bash
   git add -A
   git commit -m "add stage task and static content root configuration"
   git push heroku master
   ```

> If you're pushing from a non-master branch (such as the `step` branches from the example repository), you need to adjust
> the command to push to the master remote (such as `git push heroku step-08-deploying-to-production:master`).
>
{type="note"}

If everything's OK, you will see the URL under which it's possible to reach the application on the internet.

![Website deployment to production](deployment-to-production.png){width=700}

> You can find the state of the project after this section on the `final` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/final).
>
{type="note"}

## Addendum: Modern React with Hooks

React 16.8 introduced [Hooks](https://reactjs.org/docs/hooks-intro.html) as a novel way of using state and other React
features without writing a class. The Kotlin wrappers for React also support working with Hooks.

The two most commonly used Hooks built into React are the State and Effect Hooks. Like other hooks, they are used
in the context of functional components.

### Function components

Conceptually, React's function components themselves aren't very complex. They simply contain the instructions of how to
render a React component in a single function based on the properties passed in and don't rely on a surrounding class
structure. A very simple function component could look something like this in Kotlin:

```kotlin
external interface WelcomeProps: RProps {
    var name: String
}

val welcome = functionalComponent<WelcomeProps> { props -> 
    h1 {
        +"Hello, ${props.name}"
    }
}
```

Just like with class components, properties are defined as an external interface. It's passed to the `functionalComponent`
builder as a generic argument. Inside the builder, you can write code similar to the `render()` function in class
components – you have access to `RBuilder` functions and can use the passed-in `props`.

Similar to how class components, you can use the `child()` function to add this `welcome` component to a parent component:

```kotlin
child(welcome) {
    attrs.name = "Kotlin"
}
```

If you find this call site too cumbersome, you can create an `RBuilder()` extension function that takes a handler function,
allowing to write `welcome { name = "Kotlin"}` whenever the component is used:

```kotlin
fun RBuilder.welcome(handler: WelcomeProps.() -> Unit) = child(welcome) {
    attrs {
        handler()
    }
}
```

However, in this implementation function, components are still constrained. They show their full potential when combined
with Hooks.

### The State Hook

You can use the State Hook to keep track of the state without a class component. Consider the following implementation
of a counter inside a `functionalComponent`:

```kotlin
val counter = functionalComponent<RProps> {
    val (count, setCount) = useState(0)
    button {
        attrs.onClickFunction = { setCount(count + 1) }
        +count.toString()
    }
}
```

* `useStat` is called with an initial value `0` – meaning the type is automatically inferred to be `Int`. You can also
specify the type explicitly, which is especially useful when working with nullable values (`useState<String?>(null)`).
* Calling `useState` returns a pair (that is directly destructured): a reference to the current state
(here, `count` of type `Int`) and a function that can be used to set the state (here, `setCount()` of type `RSetState<Int>`).
* Unlike properties in a React class component, the `setCount()` function can be called without using a `setState` lambda.

React makes sure that the lifecycle is handled properly: that the count variable is only initialized with its initial
value once and that subsequent renderings use the correct updated state. It makes the work with the framework easier – you
don't have to worry about providing separate initializer functions, for example.

To learn more about the State Hook, check out the [official React documentation](https://reactjs.org/docs/hooks-state.html).

### The Effect Hook

The Effect Hook can be useful for performing side effects in a functional component – like querying an API or establishing
a connection. Consider the following implementation of a `functionalComponent` which fetches a random fact and displays
it in an `h3` tag:

```kotlin
val randomFact = functionalComponent<RProps> {
    val (randomFact, setRandomFact) = useState<String?>(null)
    useEffect(emptyList()) {
        GlobalScope.launch {
            val fortyTwoFact = window.fetch("http://numbersapi.com/42").await().text().await()
            setRandomFact(fortyTwoFact)
        }
    }
    h3 { +(randomFact ?: "Fetching...") }
}
```

To keep track of the API result, previously introduced State Hook is used. Then you call `useEffect`, run the call to the
API, and use the `setRandomFact()` function provided by the State Hook to update the stored result.

`useEffect` is called with its first parameter, its dependencies. Dependencies simply describe the props or state which
needs to change in order for the Effect Hook to be run again. In this case, you only need to make the call to the external
API once, regardless of other state changes in the application, so an `emptyList()` is passed.

If you omitted `emptyList`(), your Effect Hook would be called after each invocation of `setRandomFact`, resulting
in an endless loop.

To learn more about these nuances and other details of the Effect Hook and how it relates to the classical React lifecycle,
check out the [official React documentation](https://reactjs.org/docs/hooks-effect.html).

### Try out Hooks

If you want, you can try converting some of the components in your application – like the `videoList` – to a functional
component that uses the new Hooks API. While the `useState` hook will likely come in handy for almost all components,
the `useEffect` hook will be especially important for interacting with external APIs.

Class-based components and function components can easily coexist in the same React application – so you can also
consider writing a new functional component and adding it to the application.

## What's next

### Add more features

You can use the resulting app as a jumping-off point to explore more advanced topics in the realm of React, Kotlin/JS, and more.

* **Search**. You can add a search field to filter the list of talks by title or by author, for example. It's a great way
to learn about how [HTML form elements work in React](https://reactjs.org/docs/forms.html).
* **Persistence**. For now, the application loses track of the viewer's watch list every time the page gets reloaded.
Familiarize yourself with one of the web frameworks available for Kotlin (like [Ktor](https://ktor.io/)), and try writing
a backend for your application that can save the list of watched and unwatched videos. Or maybe there is a way to [store information on the client](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
* **Complex APIs**. There are lots of datasets and APIs available. You can pull any data into your application by building
a visualizer for [cat photos](https://thecatapi.com/) or a [royalty-free stock photo API](https://unsplash.com/developers)
for example.

### Improve the style: responsiveness and grids

The final product still doesn't fare well under extreme layout circumstances, for example, in narrow windows or on phone
screens. CSS Grids might be a fun way to explore how to make the app responsive. Bonus challenge: try without media queries.

### Try more libraries

In the [kotlin-wrappers](https://github.com/JetBrains/kotlin-wrappers) repository, you can find some more wrappers and
basic information about how to get started with additional libraries that have official Kotlin bindings, for example:
* [React-Redux](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-redux)
* [React-Router-DOM](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-router-dom)

### Join the community and get help

The best way to get help with this tutorial is to visit the official [YouTrack issue tracker](https://youtrack.jetbrains.com/issues/CRKA).
If you can't find your problem, file a new issue. You can also join the official [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
There are channels for #javascript, #react, and more.

### Learn more about coroutines

If you're interested in finding out more about how you can write concurrent code, check out the hands-on lab on [coroutines](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/01_Introduction).

### Learn more about React

Now that you know the basic concepts and how they translate to Kotlin, you can convert some of the other concepts outlined
in the [official guides on React](https://reactjs.org/docs/) into Kotlin.


