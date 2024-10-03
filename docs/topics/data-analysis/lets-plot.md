[//]: # (title: Data visualization with Lets-Plot for Kotlin)

[Lets-Plot for Kotlin (LPK)](https://lets-plot.org/kotlin/get-started.html) is a multiplatform plotting library that ports the [R's ggplot2 library](https://ggplot2.tidyverse.org/) to
Kotlin. LPK brings the feature-rich ggplot2 API to the Kotlin ecosystem,
making it suitable for scientists and statisticians who require sophisticated data visualization capabilities.

LPK targets various platforms, including [Kotlin notebooks](data-analysis-overview.md#notebooks), [Kotlin/JS](js-overview.md), [JVM's Swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/), [JavaFX](https://openjfx.io/), and [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/).
Additionally, LPK has seamless integration with [IntelliJ](https://www.jetbrains.com/idea/), [DataGrip](https://www.jetbrains.com/datagrip/), [DataSpell](https://www.jetbrains.com/dataspell/), and [PyCharm](https://www.jetbrains.com/pycharm/).

![Lets-Plot](lets-plot-overview.png){width=700}

This tutorial demonstrates how to create different plot types with
the LPK and [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) libraries using Kotlin Notebook in IntelliJ IDEA.

## Before you start

1. Download and install the latest version of [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac).
2. Install the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) in IntelliJ IDEA.

   > Alternatively, access the Kotlin Notebook plugin from **Settings** | **Plugins** | **Marketplace** within IntelliJ IDEA.
   >
   {style="tip"}

3. Create a new notebook by selecting **File** | **New** | **Kotlin Notebook**.
4. In your notebook, import the LPK and Kotlin DataFrame libraries by running the following command:

    ```kotlin
    %use lets-plot
    %use dataframe
    ```

## Prepare the data

Let's create a DataFrame that stores simulated numbers of the monthly average temperature in three cities: Berlin, Madrid, and Caracas.

Use the [`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof) function from the Kotlin DataFrame library to generate the DataFrame. Paste and run the following code snippet in your Kotlin Notebook:

```kotlin
// The months variable stores a list with 12 months of the year
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// The tempBerlin, tempMadrid, and tempCaracas variables store a list with temperature values for each month
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// The df variable stores a DataFrame of three columns, including monthly records, temperature, and cities
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
df.head(4)
```

You can see that the DataFrame has three columns: Month, Temperature, and City. The first four rows of the DataFrame
contain records of the temperature in Berlin from January to April:

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

To create a plot using the LPK library, you need to convert your data (`df`) into a `Map` type that stores the
data in key-value pairs. You can easily convert a DataFrame into a `Map` using the [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) function:

```kotlin
val data = df.toMap()
```

## Create a scatter plot

Let's create a scatter plot in Kotlin Notebook with the LPK library. 

Once you have your data in the `Map` format, use the [`geomPoint()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-point/index.html) function from the LPK library to generate the scatter plot. 
You can specify the values for the X and Y axes, as well as define categories and their color. Additionally, 
you can [customize](https://lets-plot.org/kotlin/aesthetics.html#point-shapes) the plot's size and point shapes to suit your needs:

```kotlin
// Specifies X and Y axes, categories and their color, plot size, and plot type
val scatterPlot =
    letsPlot(data) { x = "Month"; y = "Temperature"; color = "City" } + ggsize(600, 500) + geomPoint(shape = 15)
scatterPlot
```

Here's the result:

![Scatter plot](lets-plot-scatter.svg){width=600}

## Create a box plot

Let's visualize the [data](#prepare-the-data) in a box plot. Use the [`geomBoxplot()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-boxplot.html) 
function from the LPK library to generate the plot and [customize](https://lets-plot.org/kotlin/aesthetics.html#point-shapes) colors with the [`scaleFillManual()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-fill-manual.html)
function:

```kotlin
// Specifies X and Y axes, categories, plot size, and plot type
val boxPlot = ggplot(data) { x = "City"; y = "Temperature" } + ggsize(700, 500) + geomBoxplot { fill = "City" } +
    // Customizes colors        
    scaleFillManual(values = listOf("light_yellow", "light_magenta", "light_green"))
boxPlot
```

Here's the result:

![Box plot](box-plot.svg){width=600}

## Create a 2D density plot

Now, let's create a 2D density plot to visualize the distribution and concentration of some random data.

### Prepare the data for the 2D density plot

1. Import the dependencies to process the data and generate the plot:

   ```kotlin
   %use lets-plot

   @file:DependsOn("org.apache.commons:commons-math3:3.6.1")
   import org.apache.commons.math3.distribution.MultivariateNormalDistribution
   ```

   > For more information about importing dependencies to Kotlin Notebook, see the [Kotlin Notebook documentation](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies).
   > {style="tip"}

2. Paste and run the following code snippet in your Kotlin Notebook to create sets of 2D data points:

   ```kotlin
   // Defines covariance matrices for three distributions
   val cov0: Array<DoubleArray> = arrayOf(
       doubleArrayOf(1.0, -.8),
       doubleArrayOf(-.8, 1.0)
   )
   
   val cov1: Array<DoubleArray> = arrayOf(
       doubleArrayOf(1.0, .8),
       doubleArrayOf(.8, 1.0)
   )
   
   val cov2: Array<DoubleArray> = arrayOf(
       doubleArrayOf(10.0, .1),
       doubleArrayOf(.1, .1)
   )
   
   // Defines the number of samples
   val n = 400
   
   // Defines means for three distributions
   val means0: DoubleArray = doubleArrayOf(-2.0, 0.0)
   val means1: DoubleArray = doubleArrayOf(2.0, 0.0)
   val means2: DoubleArray = doubleArrayOf(0.0, 1.0)
   
   // Generates random samples from three multivariate normal distributions
   val xy0 = MultivariateNormalDistribution(means0, cov0).sample(n)
   val xy1 = MultivariateNormalDistribution(means1, cov1).sample(n)
   val xy2 = MultivariateNormalDistribution(means2, cov2).sample(n)
   ```

   From the code above, the `xy0`, `xy1`, and `xy2` variables store arrays with 2D (`x, y`) data points.

3. Convert your data into a `Map` type:

   ```kotlin
   val data = mapOf(
       "x" to (xy0.map { it[0] } + xy1.map { it[0] } + xy2.map { it[0] }).toList(),
       "y" to (xy0.map { it[1] } + xy1.map { it[1] } + xy2.map { it[1] }).toList()
   )
   ```

### Generate the 2D density plot

Using the `Map` from the previous step, create a 2D density plot (`geomDensity2D`) with a scatter plot (`geomPoint`) in the background to better visualize the
data points and outliers. You can use the [`scaleColorGradient()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-color-gradient.html) function to customize the scale of colors:

```kotlin
val densityPlot = letsPlot(data) { x = "x"; y = "y" } + ggsize(600, 300) + geomPoint(
    color = "black",
    alpha = .1
) + geomDensity2D { color = "..level.." } +
        scaleColorGradient(low = "dark_green", high = "yellow", guide = guideColorbar(barHeight = 10, barWidth = 300)) +
        theme().legendPositionBottom()
densityPlot
```

Here's the result:

![2D density plot](2d-density-plot.svg){width=600}

## What's next

* Explore more plot examples in the [Lets-Plot for Kotlin's documentation](https://lets-plot.org/kotlin/charts.html).
* Check the Lets-Plot for Kotlin's [API reference](https://lets-plot.org/kotlin/api-reference/). 
* Learn about transforming and visualizing data with Kotlin in the [Kotlin DataFrame](https://kotlin.github.io/dataframe/info.html) and [Kandy](https://kotlin.github.io/kandy/welcome.html) library documentation.
* Find additional information about the [Kotlin Notebook's usage and key features](https://www.jetbrains.com/help/idea/kotlin-notebook.html).