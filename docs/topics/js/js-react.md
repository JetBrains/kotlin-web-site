[//]: # (title: Build a web application with React and Kotlin/JS — tutorial)

This tutorial will teach you how to build a browser application with Kotlin/JS and the [React](https://reactjs.org/)
framework using the Gradle plugin. You will:

* Complete usual kinds of tasks associated with building a typical React application
* Explore how [Kotlin's DSLs](https://kotlinlang.org/docs/type-safe-builders.html) can be used to help express concepts
concisely and uniformly without sacrificing readability, allowing to write a fully-fledged application completely in Kotlin
* Learn how to use ready-made components created by the community, use external libraries, and publish the final application

The output will be a website *KotlinConf Explorer* with an overview of the [KotlinConf](https://kotlinconf.com/) event
with links to talks, which users can mark as seen or unseen and watch them all on one page.

The tutorial assumes you have prior knowledge of Kotlin and basic knowledge of HTML and CSS. Understanding the basic
concepts behind React may help understand some sample code but is not strictly required.

> You can get the final application as well as the intermediate steps [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle).
> Each step is available from its own branch and is linked at the bottom of each corresponding section.
>
{type="note"}

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).
2. Clone the [project template](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle) and open it in IntelliJ
   IDEA. The template includes a basic Kotlin/JS Gradle project with all required configurations and dependencies:

   * Dependencies and tasks in the `build.gradle(.kts)` file:
   
   ```kotlin
   dependencies {
   
       //React, React DOM + Wrappers
       implementation("org.jetbrains.kotlin-wrappers:kotlin-react:17.0.2-pre.264-kotlin-1.5.31")
       implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom:17.0.2-pre.264-kotlin-1.5.31")
       implementation(npm("react", "17.0.2"))
       implementation(npm("react-dom", "17.0.2"))
   
       //Kotlin Styled
       implementation("org.jetbrains.kotlin-wrappers:kotlin-styled:5.3.3-pre.264-kotlin-1.5.31")
       implementation(npm("styled-components", "~5.3.3"))
   
       //Video Player
       implementation(npm("react-youtube-lite", "1.1.0"))
   
       //Share Buttons
       implementation(npm("react-share", "4.4.0"))
   
       //Coroutines & serialization
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.2")
       implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.0")
   }
   ```

   * An HTML template page in `/src/main/resources/index.html` for inserting the HTML code:

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
   {validate="false"}

   The Kotlin/JS Gradle plugin bundles all of your code and its dependencies into a single JavaScript file with the same
name as the project: `confexplorer.js`. As a typical [JavaScript convention](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents),
the content of the body (including the `root` div) is loaded first to ensure that the browser loads all page elements
before the scripts.

* A code snippet in `src/main/kotlin/Main.kt`:

   ```kotlin
   // . . .
   
   fun main() {
       document.bgColor = "red"
   }
   ```

### Test the development server

The `kotlin.js` Gradle plugin comes by default with support for an embedded `webpack-dev-server`, allowing to run
the application from the IDE without manually setting up any server.

To test that the program is reaching the browser and executes, start the development server by invoking the `run` or
`browserDevelopmentRun` (available in the `other` or `kotlin browser` directory) task from the Gradle tool window inside
IntelliJ IDEA:

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

   After applying the changes, you can use the **Run** button inside IntelliJ IDEA to start the development server back up.
   To run the Gradle continuous builds from the Terminal, use `./gradlew run --continuous` instead.

2. To test this feature, change the color of the page to blue in the `Main.kt` file while the Gradle task is running:

   ```kotlin
   document.bgColor = "blue"
   ```

   The project is then recompiled, and the browser page shows the new color after the reload.

During the development, you can keep the development server running in continuous mode. It will automatically rebuild
and reload the page when you make some changes.

> You can find the state of the project after this section on the `master` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master).
>
{type="note"}

## Create the first static page with React

Change the code in the `Main.kt` file as follows:

```kotlin
import react.dom.*
import kotlinx.browser.document
import kotlinx.css.*
import kotlinx.serialization.Serializable
import styled.*

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
  to render out a component into an element called `#root`.
  This container element is defined in `/src/main/resources/index.html`, which was included in the template.
* The content is an `<h1>` headline and uses a typesafe DSL to render HTML.
* `h1` here is a function that takes a lambda parameter. When you add the `+` sign in front of the string literal,
  the `unaryPlus()` function is actually invoked using [operator overloading](https://kotlinlang.org/docs/reference/operator-overloading.html).
  It appends the string to the enclosed HTML element.

## Create a website draft with Kotlin code instead of HTML

The Kotlin [wrappers](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md) for React come
with a [domain-specific language (DSL)](https://kotlinlang.org/docs/type-safe-builders.html) that allows writing HTML in
pure Kotlin code. In this way, it's similar to [JSX](https://reactjs.org/docs/introducing-jsx.html) from JavaScript.
However, with this markup being Kotlin, you get all the benefits of a statically typed language — from autocomplete to
type-checking.

Compare classic HTML code for the future website and its typesafe variant in Kotlin:

<tabs>
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
{validate="false"}

</tab>
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
       + "John Doe: Building and breaking things"
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
</tabs>

Type or paste the above Kotlin code as the contents of your `render()` call inside the `main` function,
replacing the previous `h1` tag.

Wait for the browser to reload. The page should now look like this:

![The website draft](website-draft.png){width=700}

### Add videos using Kotlin constructs in markup

Now, replace the hardcoded list of videos with a list of real Kotlin objects:

1. Create a simple data class to hold together the attributes of a video called `Video`. You can add it in `Main.kt`
   or any other file.

   ```kotlin
   data class Video(
       val id: Int,
       val title: String,
       val speaker: String,
       val videoUrl: String
   )
   ```

2. Fill up the two lists for unwatched videos and watched videos, respectively. For now, add these declarations at
   file-level in `Main.kt`:

   ```kotlin
   val unwatchedVideos = listOf(
       Video(1, "Building and breaking things", "John Doe", "https://youtu.be/PsaFVLr8t4E"),
       Video(2, "The development process", "Jane Smith", "https://youtu.be/PsaFVLr8t4E"),
       Video(3, "The Web 7.0", "Matt Miller", "https://youtu.be/PsaFVLr8t4E")
   )
   
   val watchedVideos = listOf(
       Video(4, "Mouseless development", "Tom Jerry", "https://youtu.be/PsaFVLr8t4E")
   )
   ```

3. To use these videos on the page, write a Kotlin `for`-loop to iterate over the collection of unwatched videos.
Replace the three `p` tags under "Videos to watch" with the following snippet:

   ```kotlin
   for(video in unwatchedVideos) {
      p {
          +"${video.speaker}: ${video.title}"
      }
   }
   ```
   
4. Apply the same process to modify the code for the single tag following "Videos watched" as well:

   ```kotlin
   for(video in watchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```

Wait for the browser to reload. You should see the same layout as before. You can add some more videos to the list to make
sure that the loop is working.

### Add styles with typesafe CSS

The [kotlin-styled](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-styled) library wraps the [styled-components](https://www.styled-components.com/)
JavaScript library. allowing to define styles [globally](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-styled/README.md#global-styles)
or for individual elements of the DOM. Conceptually, that makes it similar to [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) – but for Kotlin.
The benfit of using a DSL is that you can use Kotlin code constructs to express formatting rules.

The template project for this tutorial already includes everything for using `kotlin-styled`. The relevant block in the
build configuration is this:

```kotlin
dependencies {
   //...
   //Kotlin Styled
   implementation("org.jetbrains.kotlin-wrappers:kotlin-styled:5.3.3-pre.264-kotlin-1.5.31")
   implementation(npm("styled-components", "~5.3.3"))
   //...
}
```

Instead of writing out HTML elements like `div` or `h3`, you can use their styled counterparts, `styledDiv` or `styledH3`,
making it possible to specify a `css` block for defining styles.

To move the video player to the top right corner of the page, use `styledDiv` and adjust the code for the video player
(the last `div` in the snippet) to look like this:

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

Feel free to experiment with some other styles. For example, you could change the `fontFamily`, or add some `color` to your UI.

> You can find the state of the project after this section on the `02-first-static-page` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/02-first-static-page).
>
{type="note"}

## Add the first component

The basic building blocks in React are called *[components](https://reactjs.org/docs/components-and-props.html)*.
You build your application by combining these components, which
can also be composed of other smaller components. If you structure components to be generic and reusable,
you'll be able to use them in multiple parts of the application without duplicating code or logic.

The content of the `render` function already describes a basic component. The current layout of your application looks
like this:

![Current layout](current-layout.png){width=700}

If you decompose your application into individual components, you'll end up with a more structured layout, in which
each component handles its responsibilities:

![Structured layout with components](structured-layout.png){width=700}

Creating components that encapsulate a particular functionality shortens source code and makes it easier to read and
understand.

### Structure your application

Create the main component for rendering into the `root` element, the `app`:

1. Create a new file in the `src/main/kotlin` folder called `App.kt`.
2. Inside this file, add the following snippet, and move the typesafe HTML from `Main.kt` inside the snippet:

   ```kotlin
   import kotlinx.coroutines.async
   import kotlinx.css.*
   import react.*
   import react.dom.*
   import kotlinx.browser.window
   import kotlinx.coroutines.*
   import kotlinx.serialization.decodeFromString
   import kotlinx.serialization.json.Json
   
   val app = fc<Props> {
       // typesafe HTML goes here!
   }
   ```
   
   The `fc` function creates a [function component](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

3. In the `Main.kt` file, update the `main()` function as follows:

   ```kotlin
   fun main() {
       render(document.getElementById("root")) {
           child(app)
       }
   }
   ```

For more information on React's concepts, see its [documentation and guides](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide).

### Extract a list component

Since the `watchedVideos` and `unwatchedVideos` lists both display a list of videos, it makes sense to create a single
reusable component.

The `videoList` component follows the same pattern as the `app` component. It uses the `fc` builder function,
and contains the code from the `unwatchedVideos` list.

1. Create a new file called `VideoList.kt` and add the following code:

   ```kotlin
   import kotlinx.html.js.onClickFunction
   import kotlinx.browser.window
   import react.*
   import react.dom.*
   
   val videoList = fc<Props> {
      for (video in unwatchedVideos) {
         p {
            +"${video.speaker}: ${video.title}"
         }
      }
   }
   ```

2. In `App.kt`, specify the `videoList` component by using the `child` function:

   ```kotlin
   // . . .
   div {
      h3 {
         +"Videos to watch"
      }
      child(videoList)
   
      h3 {
         +"Videos watched"
      }
      child(videoList)
   }
   // . . .
   ```

### Add props

For reusing the `videoList` component, it should be possible to fill it with different content. To do so, you can add
the ability to pass the list of items as an attribute to the component. In React, these attributes are called *props*.
When the props of a component change in React, the framework automatically re-renders the component. 

For `videoList`, you'll need a prop containing the list of videos to be shown. To do so, define an `external interface`
that holds all the props which can be passed to a `videoList` component:

1. Add the following definition to the `VideoList.kt` file:

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
   }
   ```

2. Adjust the class definition of `VideoList` to make use of those props, which are passed into the `fc` block:

   ```kotlin
   val videoList = fc<VideoListProps> { props ->
       for (video in props.videos) {
           p {
               key = video.id.toString()
               +"${video.speaker}: ${video.title}"
          }
       }
   }
   ```

   The `key` attribute helps the React renderer figure out what to do when the value of `props.videos` changes. It uses
the key to determine which parts of a list need to refresh and which ones stay the same. You can find more information
about lists and keys in the [React guide](https://reactjs.org/docs/lists-and-keys.html).

3. In the `app` component, make sure that the child components are instantiated with proper attributes. In `App.kt`,
replace the two loops underneath the `h3` elements with the respective attributes for `unwatchedVideos` and `watchedVideos`:

   ```kotlin
   child(videoList) {
       attrs {
           videos = unwatchedVideos // repeat with watchedVideos
       }
   }
   ```

The browser reload will show that the lists render correctly now.

### Make it interactive

When the user clicks on a list entry, the video player should actually play that video. To start, add an `alert` to the
video the user selects.

In the code of `videoList`, add an `onClickFunction` handler that triggers an alert with the current video:

```kotlin
// . . .
p {
   key = video.id.toString()
   attrs {
      onClickFunction = {
         window.alert("Clicked $video!")
      }
   }
   +"${video.speaker}: ${video.title}"
}
// . . .
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
*state* specific to this component.

State is one of the other core concepts in React. In modern React (using the so-called Hooks API), state is expressed
using the [`useState` hook](https://reactjs.org/docs/hooks-state.html).

1. Add the following line of code to the top of the `videoList` declaration:

   ```kotlin
   val videoList = fc<VideoListProps> { props ->
      var selectedVideo: Video? by useState(null)
   // . . .
   ```
   {validate="false"}

   * The `videoList` functional component keeps state (a value that is independent of the current function invocation). The
   state is nullable, and of type `Video?`. Its default value is `null`.
   * By using the `useState` function from the React framework, you instruct the framework to keep track of state across
   multiple invocations of the function. For example, even though you specify a default value, React makes sure that the
   default value is only assigned in the beginning. When the state changes, the component will re-render based on the new state.
   * The `by` keyword indicates that `useState` acts as a [delegated property](https://kotlinlang.org/docs/delegated-properties.html).
   Just like any other variable, you read and write values. The implementation behind `useState` takes care of the machinery
   required to make state work.

   To learn more about the State Hook, check out the [React documentation](https://reactjs.org/docs/hooks-state.html).

2. Change your implementation of the `videoList` component to look as follows:

   ```kotlin
   val videoList = fc<VideoListProps> { props ->
      var selectedVideo: Video? by useState(null)
      for (video in props.videos) {
         p {
            key = video.id.toString()
            attrs {
               onClickFunction = {
                  selectedVideo = video
               }
            }
            if (video == selectedVideo) {
               +"▶ "
            }
            +"${video.speaker}: ${video.title}"
         }
      }
   }
   ```

   * When the user clicks a video, its value is assigned to the `selectedVideo` variable.
   * When the selected list entry is rendered, the triangle is prepended.
   

You can find more details about states in the [React FAQ](https://reactjs.org/docs/faq-state.html).

Check the browser and click an item in the list and see if everything works correctly.

> You can find the state of the project after this section on the `03-first-component` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/03-first-component).
>
{type="note"}

## Compose components

Currently, two video lists work on their own, meaning that each list keeps track of the selected video.
Users can select two videos both in the unwatched and watched videos lists, even though there's only one player:

![Two videos are selected in both lists simultaneously](two-videos-select.png){width=700}

A list can't keep track of both which video is selected inside itself, and inside a sibling list because the selected
video is not part of the *list* state, but of the *application* state. This means you need to *lift* the state out of the
individual components.

### Lift state

React makes sure that props can only be passed from a parent component to its children. This prevents components from
being hard-wired together.

If a component wants to change the state of a sibling component, it needs to do so via its parent.
At that point, the state also no longer belongs to any of the child components but to the overarching parent component.

The process of migrating state from components to their parents is called *lifting state*.

For your app, add `currentVideo` as state to the `app` component:

1. In `App.kt`, add the following to the top of the definition of the `app` component:

   ```kotlin
   val app = fc<Props> {
       var currentVideo: Video? by useState(null)
       // . . .
   }
   ```

   The`videoList` component does not need to keep track of the state anymore. It will receive the current video as a prop instead.

2. Remove the `useState` call in `videoList`.
3. Prepare the `videoList` component to receive the selected video as a prop. For that, expand the `VideoListProps`
interface to contain the `selectedVideo`:

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
       var selectedVideo: Video?
   }
   ```

4. Fix the condition for the triangle highlight to use `props` instead of `state`:

   ```kotlin
   if(video == props.selectedVideo) {
       +"▶ "
   }
   ```

### Pass handlers

Now there's no way to assign a value to a prop, so the `onClickFunction` won't work the way it currently does. To change
the state of a parent component, you need the state lifting again.

In React, state always flows from parent to child. So, to change *application* state from one of the child components,
you need to move the logic for handling user interaction to the parent component and then pass the logic in as a prop.
Remember that in Kotlin, variables can have the [type of a function](https://kotlinlang.org/docs/reference/lambdas.html#function-types).

1. Expand the `VideoListProps interface` so that it contains a variable `onSelectVideo()`, which is a function taking a
`Video` and returning `Unit`:

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
       var selectedVideo: Video?
       var onSelectVideo: (Video) -> Unit
   }
   ```

2. In the `videoList` component, use the new prop in the `onClickFunction` handler:

   ```kotlin
   onClickFunction = {
       props.onSelectVideo(video)
   }
   ```

3. Now, you can go back to the `app` component and pass the `selectedVideo` and a handler for `onSelectVideo`
for each of the two video lists:

   ```kotlin
   child(videoList) {
       attrs {
           videos = unwatchedVideos
           selectedVideo = currentVideo
           onSelectVideo = { video ->
               currentVideo = video
           }
       }
   }
   ```

4. Repeat the previous step for the watched videos list.

Switch back to your browser and check that when selecting a video the selection jumps between the two lists without duplication.

> You can find the state of the project after this section on the `04-composing-components` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/04-composing-components).
>
{type="note"}

## Add more components

### Extract the video player component

You can now create another self-contained unit, a video player, that is currently a placeholder image. A video player
needs to know the talk title, the author of the talk, and the link to the video. This information is already contained
in a `Video` object, so you can pass it as a prop and access its attributes.

1. Create a new file called `VideoPlayer.kt` and add the following implementation for the `videoPlayer` component:

   ```kotlin
   import kotlinx.css.*
   import kotlinx.html.js.onClickFunction
   import react.*
   import react.dom.*
   import styled.*
   
   external interface VideoPlayerProps : Props {
      var video: Video
   }
   
   val videoPlayer = fc<VideoPlayerProps> { props ->
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
   ```

2. Because the `VideoPlayerProps` interface specifies that the `videoPlayer` component takes a non-null `Video`, make sure
to handle this in the `app` component accordingly. 

   In `App.kt`, replace the previous `styledDiv` snippet for the video player with the following:

   ```kotlin
   currentVideo?.let { curr ->
       child(videoPlayer) {
           attrs {
               video = curr
           }
       }
   }
   ```

   The [`let` scope function](https://kotlinlang.org/docs/scope-functions.html#let), ensures that the `videoPlayer` component
   is only added when `state.currentVideo` is not null.

Now clicking an entry in the list will bring up the video player and populate it with the information from the clicked entry.

### Add a button and wire it

To make it possible for users to mark a video as watched or unwatched and to move it between the two lists,
add a button to the `VideoPlayer` component.

Since this button will move videos between two different lists, the logic handling the state change needs to be *lifted*
out of the `videoPlayer`, and passed in from the parent as a prop. The button should look different based on whether the
video has been watched or not. This is also information you need to pass as a prop.

1. Expand the `VideoPlayerProps` interface in `VideoPlayer.kt` to include properties for those two cases::

   ```kotlin
   external interface VideoPlayerProps : Props {
       var video: Video
       var onWatchedButtonPressed: (Video) -> Unit
       var unwatchedVideo: Boolean
   }
   ```

2. Now, you can add the button to the actual component. Copy the following snippet to the body of the `videoPlayer`
component, between the `h3` and `img` tags:

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
   With the help of Kotlin DSLs, the color of the button is changed dynamically using a basic Kotlin `if` expression.

### Move video lists to the application state

Now it's time to adjust the `VideoPlayer` usage site in the `app` component. When the button is clicked, a video
should be moved from the unwatched list to the watched list or vice versa. Since these lists can now actually
change, move them into the application state:

1. In `App.kt`, add the following `useState` calls to the top of the `app` component:

   ```kotlin
   val app = fc<Props> {
       var currentVideo: Video? by useState(null)
       var unwatchedVideos: List<Video> by useState(listOf(
           Video(1, "Building and breaking things", "John Doe", "https://youtu.be/PsaFVLr8t4E"),
           Video(2, "The development process", "Jane Smith", "https://youtu.be/PsaFVLr8t4E"),
           Video(3, "The Web 7.0", "Matt Miller", "https://youtu.be/PsaFVLr8t4E")
       ))
       var watchedVideos: List<Video> by useState(listOf(
           Video(4, "Mouseless development", "Tom Jerry", "https://youtu.be/PsaFVLr8t4E")
       ))
       // . . .
   }
   ```

2. Since all of the demo data is included in the default values for `watchedVideos` and `unwatchedVideos` directly,
you no longer need the file-level declarations. In `Main.kt`, delete the declarations for `watchedVideos` and `unwatchedVideos`.

3. Change the call-site for `videoPlayer` in the `app` component that belongs to the video player to look as follows:

   ```kotlin
   child(videoPlayer) {
       attrs {
           video = curr
           unwatchedVideo = curr in unwatchedVideos
           onWatchedButtonPressed = {
               if (video in unwatchedVideos) {
                   unwatchedVideos = unwatchedVideos - video
                   watchedVideos = watchedVideos + video
               } else {
                   watchedVideos = watchedVideos - video
                   unwatchedVideos = unwatchedVideos + video
               }
           }
   
       }
   }
   ```

Go back to the browser, select a video, and press the button a few times. The video will jump between the two lists.

> You can find the state of the project after this section on the `05-more-components` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/05-more-components).
>
{type="note"}

## Use packages from NPM

To make the app usable, you still need a video player that actually plays videos and some social share buttons to help people
share the content.

React has a rich ecosystem with a lot of pre-made components you can use instead of building this functionality yourself.

### Add the video player component

To replace the placeholder video component with an actual YouTube player, use the [react-youtube-lite](https://www.npmjs.com/package/react-youtube-lite) package from npm.
It can show video and control the appearance of the player.

For the component documentation and the API description, see its [README](https://www.npmjs.com/package/react-youtube-lite)
in GitHub.

1. Check the `build.gradle(.kts)` file. The `react-youtube-lite` package should be already included:

   ```kotlin
   dependencies {
       //...
       //Video Player
       implementation(npm("react-youtube-lite", "1.1.0"))
       //...
   }
   ```

   As you can see, npm dependencies can be added to a Kotlin/JS project by using the `npm` function in the `dependencies`
block of the build file. The Gradle plugin then takes care of downloading and installing these dependencies for you. To
do so, it uses its own bundled installation of the [`yarn`](https://yarnpkg.com/) package manager.

2. To use the JavaScript package from inside the React application, it's necessary to tell the Kotlin compiler what to expect.
   For this, provide it with [external declarations](https://kotlinlang.org/docs/js-interop.html). 

   Create a file called `ReactYouTube.kt` and add the following content:

   ```kotlin
   @file:JsModule("react-youtube-lite")
   @file:JsNonModule
   
   import react.*
   
   @JsName("ReactYouTubeLite")
   external val reactPlayer: ComponentClass<dynamic>
   ```

   When the compiler sees an external declaration like `reactPlayer`, it assumes that the implementation for the
corresponding class is provided by the dependency and doesn't generate code for it.

   The last two lines are equivalent to a JavaScript import like `require("react-youtube-lite").default;`. It tells
the compiler that it's certain that there'll be a component conforming to `ComponentClass<dynamic>` at runtime.

However, in this configuration, the generic type for the props accepted by `reactPlayer` is set to `dynamic`. That means
the compiler will just accept any code, at the risk of breaking things at runtime.

A better alternative would be to create an `external interface`, which specifies what kind of properties belong to the
props for this external component. You can infer the props interface based on the [README](https://www.npmjs.com/package/react-youtube-lite)
for the component — `react-youtube-lite` takes a prop called `url` of type `String`:

1. Adjust the content of `ReactPlayer.kt` accordingly:

   ```kotlin
   @file:JsModule("react-youtube-lite")
   @file:JsNonModule
   
   import react.*
   
   @JsName("ReactYouTubeLite")
   external val reactPlayer: ComponentClass<ReactYouTubeProps>
   
   external interface ReactYouTubeProps : Props {
       var url: String
   }
   ```

2. You can now use the new `reactPlayer` to replace the gray placeholder rectangle in the `videoPlayer` component. In
`VideoPlayer.kt`, replace the `img` tag with the following snippet:

   ```kotlin
   reactPlayer {
       attrs.url = props.video.videoUrl
   }
   ```

### Add social share buttons

An easy way to share the content in the application is to have social share buttons for messengers and email. You can use
an off-the-shelf React component for this as well, for example, [react-share](https://github.com/nygardk/react-share/blob/master/README.md).

1. Check the `build.gradle.kts` file. This npm library should be already included:

   ```kotlin
   dependencies {
       //...
       //Share Buttons
       implementation(npm("react-share", "4.4.0"))
       //...
   }
   ```

2. To use `react-share` from Kotlin, you'll need to write some basic external declarations. [Examples on GitHub](https://github.com/nygardk/react-share/blob/master/demo/Demo.jsx#L61)
show that a share button consists of two react components: `EmailShareButton` and `EmailIcon`, for example. Different types
of share buttons and icons all have the same kind of interface.
   Creating the external declarations for each component happens the same way as you already did for the video player.

   Add the following code to a new file called `ReactShare.kt`:

   ```kotlin
   @file:JsModule("react-share")
   @file:JsNonModule
   
   import react.ComponentClass
   import react.Props
   
   @JsName("EmailIcon")
   external val emailIcon: ComponentClass<IconProps>
   
   @JsName("EmailShareButton")
   external val emailShareButton: ComponentClass<ShareButtonProps>
   
   @JsName("TelegramIcon")
   external val telegramIcon: ComponentClass<IconProps>
   
   @JsName("TelegramShareButton")
   external val telegramShareButton: ComponentClass<ShareButtonProps>
   
   external interface ShareButtonProps : Props {
       var url: String
   }
   
   external interface IconProps : Props {
       var size: Int
       var round: Boolean
   }
   ```

3. Add new components into the user interface of the application. In `VideoPlayer.kt`, add two share buttons in a `styledDiv`
right above the usage of `reactPlayer`:

   ```kotlin
   // . . .
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
   // . . .
   ```

You can now check your browser and see if the buttons actually work. When clicking on the button, a *share window* should appear with the URL of the video.
If buttons don't show up or work, you may need to disable your ad/social blocker for it to work.

![Share window](social-buttons.png)

Feel free to repeat this step with share buttons for some other social networks available in [react-share](https://github.com/nygardk/react-share/blob/master/README.md#features).

> You can find the state of the project after this section on the `06-packages-from-npm` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/06-packages-from-npm).
>
{type="note"}

## Use an external REST API

You can now substitute hard-coded demo data for the content by pulling some real data from a REST API into the app instead.

For this tutorial, there's a [small API](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1).
It offers only a single endpoint, `videos`, and takes a numeric parameter to access an element from the list. If you visit
the API with your browser, you will see that the objects returned from the API follow the same structure as `Video` objects.

### Use JS functionality from Kotlin

Browsers already come with a large variety of [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API). You can also use
them from Kotlin/JS: it includes wrappers for these APIs out of the box. One relevant example is the
[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which is used for making HTTP requests.

The first challenge is that browser APIs like `fetch` use [callbacks](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
to perform non-blocking operations. When multiple callbacks are supposed to run one after the other, they need to be nested.
Naturally, the code gets heavily indented, with more and more functionality stacked inside each other, and gets harder to read.

Instead, you can use Kotlin's coroutines, a better approach for such functionality.

A second challenge comes again from the dynamically typed nature of JavaScript. There are no guarantees about the type
of data returned from the external API. To solve this, you can use the `kotlinx.serialization` library.

Check the `build.gradle(.kts)` file. The relevant snippet should already exist:

```kotlin
dependencies {
    //. . .
    //Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.2")
}
```

### Add serialization

When you call external API, you get back JSON-formatted text that still needs to be turned into a Kotlin
object to work with.

[`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) is a library that allows writing these
types of conversions: from JSON strings to Kotlin objects.

1. Check the `build.gradle.kts` file. The corresponding snippet should already exist:

   ```kotlin
   plugins {
       // . . .
       kotlin("plugin.serialization") version "1.5.31"
   }
   
   dependencies {
       //. . .
       //Serialization
       implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.0")
   }
   ```

2. As preparation for fetching the first video, it's necessary to tell the serialization library about the `Video` class.
In `Main.kt`, add the `@Serializable` annotation to its definition:

```kotlin
@Serializable
data class Video(
    val id: Int,
    val title: String,
    val speaker: String,
    val videoUrl: String
)
```

### Fetch videos

Inside `App.kt` (or a new file), add the following function that can `fetch` a video from the API:

```kotlin
suspend fun fetchVideo(id: Int): Video {
    val response = window
        .fetch("https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/$id")
        .await()
        .text()
        .await()
    return Json.decodeFromString(response)
}
```

* *Suspending function* `fetch`es a video from the API given an `id`. This response may take a while, so you `await`
the result. Next, `text()`, which uses a callback, reads the body from the response. Then you `await` for it to complete as well.
* Before returning the value of the function, you pass it to `Json.decodeFromString`, a function from `kotlinx.coroutines`.
It converts the JSON text you received from the request into a Kotlin object with the appropriate fields.
* A function call like `window.fetch` returns a `Promise` object. You would have to define a callback handler that gets
invoked once the `Promise` is resolved and a result is available. However, with coroutines, you can `await` those promises.
Whenever a function like `await()` is called, the method stops (suspends) its execution. It continues execution once
the `Promise` can be resolved.

To give users a selection of videos, you can define the `fetchVideos()` function, which will fetch 25 videos from the
same API as above. To run all the requests concurrently, use the [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)
functionality provided by Kotlin's coroutines:

1. Add the following implementation to your `App.kt`:

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
   the implementation is wrapped in a `coroutineScope`. You can then start 25 asynchronous tasks (one per request) and wait
   for all of them to complete.

2. You can now add the data to your application. Add the definition for a `mainScope`, and change your `app` component
to start with the following snippet. Don't forget to replace demo values with `emptyLists` as well:

   ```kotlin
   val mainScope = MainScope()
   
   val app = fc<Props> {
      var currentVideo: Video? by useState(null)
      var unwatchedVideos: List<Video> by useState(emptyList())
      var watchedVideos: List<Video> by useState(emptyList())
   
      useEffectOnce {
         mainScope.launch {
            unwatchedVideos = fetchVideos()
         }
      }
   // . . .
   ```
   {validate="false"}

   * The [`MainScope`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html)
   is a part of Kotlin's structured concurrency model and creates the scope for asynchronous tasks to run in.
   * `useEffectOnce` is another React *hook* (specifically, a simplified version of the [useEffect](https://reactjs.org/docs/hooks-effect.html) hook).
It indicates that the component performs a *side effect*. It doesn't just render itself but also communicates over the network.

Check your browser. The application should show actual data:

![Fetched data from API](website-api-data.png){width=700}

When you load the page:

* The code of the `app` component will be invoked. This starts the code in the `useEffectOnce` block.
* The `app` component is rendered with empty lists for the watched and unwatched videos.
* When the API requests finish, the `useEffectOnce` block assigns it to the state of the `app` component. This triggers a re-render.
* The code of the `app` component will be invoked again, but the `useEffectOnce` block *will not* run for a second time.

If you want to get an in-depth understanding of how coroutines work, check this [hands-on on coroutines](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/).

> You can find the state of the project after this section on the `07-using-external-rest-api` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/07-using-external-rest-api).
>
{type="note"}

## Deploy to production and the cloud

It's time to get the application published to the cloud and make it accessible for other people.

### Package a production build

To package all assets in production mode, run the `build` task in Gradle via the tool window in IntelliJ IDEA or by
running `./gradlew build`. This generates an optimized project build, applying various improvements such as DCE
(dead code elimination).

Once the build has finished, you can find all the files needed for deployment in `/build/distributions`. They include the JS files,
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

5. To allow the `heroku/gradle` buildpack to run properly, a `stage` task needs to be in the `build.gradle(.kts)` file.
It's equivalent to the `build` task, and the corresponding alias is already included at the bottom of the file:

   ```kotlin
   // Heroku Deployment
   tasks.register("stage") {
       dependsOn("build")
   }
   ```

6. Configure the `buildpack-static` by adding a file called `static.json` to the project root. Add the `root` property
   inside the file, as follows:

   ```xml
   {
       "root": "build/distributions"
   }
   ```
   {validate="false"}

7. You can now trigger a deployment, for example, by running the following command:

   ```bash
   git add -A
   git commit -m "add stage task and static content root configuration"
   git push heroku master
   ```

> If you're pushing from a non-main branch (like a step branch from the example repository), you need to adjust
> the command to push to the `main` remote (such as `git push heroku 08-deploying-to-production:main`).
>
{type="note"}

If everything's OK, you will see the URL under which it's possible to reach the application on the internet.

![Website deployment to production](deployment-to-production.png){width=700}

> You can find the state of the project after this section on the `finished` branch [here](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished).
>
{type="note"}

## What's next

### Add more features

You can use the resulting app as a jumping-off point to explore more advanced topics in the realm of React, Kotlin/JS, and more.

* **Search**. You can add a search field to filter the list of talks by title or by author, for example. To do so, learn
about how [HTML form elements work in React](https://reactjs.org/docs/forms.html).
* **Persistence**. For now, the application loses track of the viewer's watch list every time the page gets reloaded.
Consider building your own backend, using one of the web frameworks available for Kotlin (like [Ktor](https://ktor.io/)).
Alternatively, look into ways of [storing information on the client](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
* **Complex APIs**. There are lots of datasets and APIs available. You can pull any data into your application, for example,
build a visualizer for [cat photos](https://thecatapi.com/) or a [royalty-free stock photo API](https://unsplash.com/developers).

### Improve the style: responsiveness and grids

The application design is still very simple and won't look great on mobile devices or in narrow windows. Explore
some more of the CSS DSL to make the app more accessible.

### Join the community and get help

The best way to report problems and get help is the [kotlin-wrappers issue tracker](https://github.com/JetBrains/kotlin-wrappers/issues).
If you can't find your problem, file a new issue. You can also join the official [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
There are channels for `#javascript` and `#react`.

### Learn more about coroutines

If you're interested in finding out more about how you can write concurrent code, check out the hands-on lab on [coroutines](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/01_Introduction).

### Learn more about React

Now that you know the basic concepts and how they translate to Kotlin, you can convert some other concepts outlined
in the [official guides on React](https://reactjs.org/docs/) into Kotlin.
