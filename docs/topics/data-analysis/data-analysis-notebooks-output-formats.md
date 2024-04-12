[//]: # (title: Output formats supported by Kotlin Notebook)

Kotlin Notebook supports a variety of output types, including text, HTML, and images. With the help of external libraries,
you can expand your output options and visualize your data with charts, spreadsheets, and more.

Each output is a JSON object that maps the [Jupiter MIME type](https://jupyterlab.readthedocs.io/en/latest/user/file_formats.html)
to some data. From this map, Kotlin Notebook selects the supported MIME type with the highest priority among other
types and renders it like this:

* [Text](#texts) uses the `text/plain` MIME type.
* The [BufferedImage class](#buffered-images) uses the `image/png` MIME type that is mapped to a Base64 string.
* The [Image class](#loaded-images), as well as the [LaTeX format](#math-formulas-and-equations), use the `text/html` MIME
  type with the `img` tag inside.
* [Kotlin DataFrame tables](#data-frames) and [Kandy plots](#charts) use their own internal MIME types, which are backed
  by static HTML or images. This way, you can display them on GitHub.

You can set up the mapping manually, for example, to use Markdown as a cell output:

```kotlin
MimeTypedResult(
    mapOf(
        "text/plain" to "123",
        "text/markdown" to "# HEADER",
        //other mime:value pairs
    )
)
```

To display any kind of output, use the `DISPLAY()` function. It also enables the combination of several outputs:

```kotlin
DISPLAY(HTML("<h2>Gaussian distribution</h2>"))
DISPLAY(LATEX("f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\cdot e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}"))

val experimentX = experimentData.map { it.key }
val experimentY = experimentData.map { it.value }

DISPLAY(plot {
    bars {
        x(experimentX)
        y(experimentY)
    }
})
```

![Different outputs for Gaussian distribution](gaussian-distribution-output.png){width=700}

## Texts

### Plain text

The simplest output type is plain text. It's used in printed statements, variable values, or any text-based output from
your code:

```kotlin
val a1: Int = 1
val a2: Int = 2
var a3: Int? = a1 + a2

"My answer is $a3"
```

![Plain text code output](plain-text-output.png){width=300}

* If a cell's result cannot be [rendered](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#rendering)
  and displayed as any of the output types, it will be printed as plain text using the `toString()` function.
* If your code contains errors, Kotlin Notebook displays an error message and a traceback, providing insights for debugging.

### Rich text

Choose cells of the Markdown type to use rich text. This way, you can format the content with Markdown and HTML markup,
using lists, tables, font styles, code blocks, and more. HTML can contain CSS styles and JavaScript.

```none
## Line magics

| Spell                              | Description                                                                                                      | Example                                                                               |
|------------------------------------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| <code>%use</code>                  | Injects code for supported libraries: artifact resolution, default imports, initialization code, type renderers. | <code>%use klaxon(5.5), lets-plot</code>                                              |                                         
| <code>%trackClasspath</code>       | Logs any changes of current classpath. Useful for debugging artifact resolution failures.                        | <code>%trackClasspath [on |off]</code>                                                |
| <code>%trackExecution</code>       | Logs pieces of code that are going to be executed. Useful for debugging of libraries support.                    | <code>%trackExecution [all|generated|off]</code>                                      |          
| <code>%useLatestDescriptors</code> | Use latest versions of library descriptors available. By default, bundled descriptors are used.                  | <code>%useLatestDescriptors [on|off]</code>                                           |
| <code>%output</code>               | Output capturing settings.                                                                                       | <code>%output --max-cell-size=1000 --no-stdout --max-time=100 --max-buffer=400</code> |
| <code>%logLevel</code>             | Set logging level.                                                                                               | <code>%logLevel [off|error|warn|info|debug]</code>                                    |

<ul><li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics.md">Learn more detailes about line magics</a>.</li>
<li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics.md">See the full list of supported libraries</a>.</li></ul>
```

![Rich text in Markdown cells](markdown-cells-output.png){width=700}

## HTML

Kotlin Notebook can render HTML directly, executing scripts or even embedding websites:

```none
HTML("""
<p>Counter: <span id="ctr">0</span> <button onclick="inc()">Increment</button></p>
<script>
    function inc() {
        let counter = document.getElementById("ctr")
        counter.innerHTML = parseInt(counter.innerHTML) + 1;
}
</script>
""")
```

![Using HTML script](direct-html-output.png){width=300}


> Mark your notebook as **Trusted** at the top of the file to be able to execute scripts.
>
{type="note"}

## Images

With Kotlin Notebook, you can display images from files, generated graphs, or any other visual media.
Static images can be displayed in formats such as `.png`, `jpeg`, and `.svg`.

### Buffered images

By default, you can use `BufferedImage` class to display images:

```kotlin
import java.awt.Color
import java.awt.image.BufferedImage

val width = 300
val height = width

val image = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)

val graphics = image.createGraphics()
graphics.background = Color.BLACK
graphics.clearRect(0, 0, width, height)
graphics.setRenderingHint(
    java.awt.RenderingHints.KEY_ANTIALIASING,
    java.awt.RenderingHints.VALUE_ANTIALIAS_ON
)
graphics.color = Color.WHITE
graphics.fillRect(width / 10, height * 8 / 10, width * 10 / 20, height / 10)
graphics.dispose()
```

![Using default BufferedImage to display images](bufferedimage-output.png){width=400}

### Loaded images

With the help of the `lib-ext` library, you can extend the standard Jupyter functionality and display images loaded
from the network:

```none
%use lib-ext(0.11.0-398)
```

```kotlin
Image("https://kotlinlang.org/docs/images/kotlin-logo.png", embed = false).withWidth(300)
```

![Using external image links](external-images-output.png){width=400}

### Embedded images

A disadvantage of images loaded from the network is that the image disappears if the link breaks or if you lose
the network connection. To work around that, use embedded images, for example:

```kotlin
val kotlinMascot = Image("https://blog.jetbrains.com/wp-content/uploads/2023/04/DSGN-16174-Blog-post-banner-and-promo-materials-for-post-about-Kotlin-mascot_3.png", embed = true).withWidth(400)
kotlinMascot
```

![Using embedded images](embedded-images-output.png){width=400}

## Math formulas and equations

You can render mathematical formulas and equations using the LaTeX format, a typesetting system widely used in academia:

1. Add the `lib-ext` library that extends the functionality of the Jupyter kernel to your notebook:

   ```none
   %use lib-ext(0.11.0-398)
   ```

2. In the new cell, run your formula:

   ```none
   LATEX("c^2 = a^2 + b^2 - 2 a b \\cos\\alpha")
   ```

   ![Using LaTeX to render mathematical formulas](latex-output.png){width=300}

## Data frames

With Kotlin Notebook, you can visualize structured data with data frames:

1. Add the [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) library to your notebook:

   ```none
   %use dataframe
   ```

2. Create the data frame and run it in the new cell:

   ```kotlin
   val months = listOf(
       "January", "February",
       "March", "April", "May",
       "June", "July", "August",
       "September", "October", "November",
       "December"
   )

   // Sales data for different products and regions:
   val salesLaptop = listOf(120, 130, 150, 180, 200, 220, 240, 230, 210, 190, 160, 140)
   val salesSmartphone = listOf(90, 100, 110, 130, 150, 170, 190, 180, 160, 140, 120, 100)
   val salesTablet = listOf(60, 70, 80, 90, 100, 110, 120, 110, 100, 90, 80, 70)
    
   // A data frame with columns for Month, Sales, and Product
   val dfSales = dataFrameOf(
       "Month" to months + months + months,
       "Sales" to salesLaptop + salesSmartphone + salesTablet,
       "Product" to List(12) { "Laptop" } + List(12) { "Smartphone" } + List(12) { "Tablet" },
   )
   ```

   The data frame uses the `dataFrameOf()` function and includes the number of products (laptops, smartphones,
   and tablets) sold in a 12-month period.

3. Explore the data in your frame, for example, by finding the product and month with the highest sales:

   ```none
   dfSales.maxBy("Sales")
   ```

   ![Using DataFrame to visualize data](dataframe-output.png){width=500}

4. You can also export your data frame as a CSV file:

   ```kotlin
   // Export your data to CSV format
   dfSales.writeCSV("sales-stats.csv")
   ```

## Charts

You can create various charts directly in your Kotlin Notebook to visualize your data:

1. Add the [Kandy](https://kotlin.github.io/kandy/welcome.html) plotting library to your notebook:

   ```none
   %use kandy
   ```

2. Use the same data frame and run the `plot()` function in the new cell:
 
   ```kotlin
   val salesPlot = dfSales.groupBy { Product }.plot {
       bars {
           // Access the data frame's columns used for the X and Y axes
           x(Month)
           y(Sales)
           // Access the data frame's column used for categories and sets colors for these categories
           fillColor(Product) {
               scale = categorical(
                   "Laptop" to Color.PURPLE,
                   "Smartphone" to Color.ORANGE,
                   "Tablet" to Color.GREEN
               )
               legend.name = "Product types"
           }
       }
       // Customize the chart's appearance
       layout.size = 1000 to 450
       layout.title = "Yearly Gadget Sales Results"
   }

   salesPlot
   ```

   ![Using Kandy to render visualize data](kandy-output.png){width=700}

3. You can also export your plot in the `.png`, `jpeg`, `.html`, or `.svg` format:

   ```kotlin
   // Specify the output format for the plot file:
   salesPlot.save("sales-chart.svg")
   ```

## What's next

* [Visualize data using the DataFrame and Kandy libraries](data-analysis-visualization.md)
* [Retrieve data from the CSV and JSON files](data-analysis-work-with-data-sources.md)
* [Check out the list of recommended libraries](data-analysis-libraries.md)