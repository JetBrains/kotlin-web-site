[//]: # (title: Data visualization with Kandy)
[//]: # (description: Learn how to visualize data in Kotlin Notebook with Kandy and Kotlin DataFrame by creating line, points, and bar charts.)

Kotlin offers an all-in-one-place solution for powerful and flexible data visualization, providing an intuitive way to present and explore data 
before diving into complex models.

This tutorial demonstrates how to create different chart types in IntelliJ IDEA using [Kotlin Notebook](kotlin-notebook-overview.md) with
the [Kandy](https://kotlin.github.io/kandy/welcome.html) and [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) libraries.

## Before you start

Kotlin Notebook relies on the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
which is bundled and enabled in IntelliJ IDEA by default.

If the Kotlin Notebook features are not available, ensure the plugin is enabled. For more information,
see [Set up an environment](kotlin-notebook-set-up-env.md).

To follow this tutorial:

1. Create a [new Kotlin Notebook](kotlin-notebook-create.md).
2. Import [Kandy](https://kotlin.github.io/kandy/welcome.html) and [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html):

   ```kotlin
   %use kandy
   %use dataframe
   ```

> Make sure to run the code cell with the `%use dataframe` line before you run any other code cells
> that rely on the Kotlin DataFrame library.
>
{style="note"}


## Create a DataFrame

To start, let's create a `DataFrame` with data to visualize. This `DataFrame` stores
simulated monthly average temperatures for Berlin, Madrid, and Caracas:

```kotlin
// The months variable stores a list with the 12 months of the year
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// The tempBerlin, tempMadrid, and tempCaracas variables store a list 
// with temperature values for each month
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)
```

Now let’s create a new variable (`df`) and use
[`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof)
to generate a DataFrame of three columns (Month, Temperature, and City):

```kotlin
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```
To preview the data, use the [`head()`](https://kotlin.github.io/dataframe/head.html) function:

```kotlin
df.head(4) // Returns first four rows
```

Since the `DataFrame` has three columns (Month, Temperature, and City). The first four rows store temperature 
in Berlin from January to April:

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

> There are different options to access a column's records that can help you increase type safety when working with the Kandy and Kotlin DataFrame libraries together.
> For more information, see [Access APIs](https://kotlin.github.io/dataframe/apilevels.html).
>
{style="tip"}

## Create a line chart

Let's create a line chart in Kotlin Notebook using the `df` DataFrame from the previous section.
For that:

1. Call the `plot()` function from the Kandy library. 
2. Apply the `line` layer. 
3. Map the `Month` and `Temperature` columns to the `X` and `Y` axes accordingly.
4. (Optional) Customize colors and sizes.


```kotlin
df.plot {
   line {
      x(Month)
      y(Temperature)

      color(City) {
         scale = categorical(
            "Berlin" to Color.hex("#6F4E37"),
            "Madrid" to Color.hex("#C2D4AB"),
            "Caracas" to Color.hex("#B5651D")
         )
      }
      width = 1.5
   }
   layout {
      size = 1000 to 450
   }
}
```

Here's the result:

![Line chart](visualization-line-chart.svg){width=600}

## Create a points chart

Now, let's visualize the `df` DataFrame in a points (scatter) chart. For that:

1. Call the `plot()` function from the Kandy library. 
2. Apply the `points` layer. 
3. Map the `Month` and `Temperature` columns to the `X` and `Y` axes accordingly.
4. (Optional) Customize colors, axis labels, point sizes, and chart title.


```kotlin
df.plot {
   points {
      x(Month) {
         axis.name = "Month"
      }
      y(Temperature) {
         axis.name = "Temperature"
      }

      color(City) {
         scale = categorical(
            "Berlin" to Color.hex("#6F4E37"),
            "Madrid" to Color.hex("#C2D4AB"),
            "Caracas" to Color.hex("#B5651D")
         )
      }
      size = 5.5
   }
   layout {
      title = "Temperature per month"
   }
}

```

Here's the result:

![Points chart](visualization-points-chart.svg){width=600}

## Create a bar chart

Finally, let's create a bar chart for each city.
For that:

1. Use `groupBy` to group the `DataFrame` by the `City` column. 
2. Call the `plot()` function from the Kandy library. 
3. Apply the `bars` layer.
4. (Optional) Add a title for the chart, customize colors.


```kotlin
df.groupBy { City }.plot {
    bars {
        x(Month)
        y(Temperature)
        
        fillColor(City) {
            scale = categorical(
                "Berlin" to Color.hex("#6F4E37"),
                "Madrid" to Color.hex("#C2D4AB"),
                "Caracas" to Color.hex("#B5651D")
            )
        }
    }
    layout.title {
       title = "Temperature per month"
    }
}
```

Here's the result:

![Bar chart](visualization-bar-chart.svg){width=600}

## What's next

* Explore more chart examples in the [Kandy library documentation](https://kotlin.github.io/kandy/examples.html)
* Explore more advanced plotting options in the [Lets-Plot library documentation](lets-plot.md)
* Find additional information about creating, exploring, and managing data frames in the [Kotlin DataFrame library documentation](https://kotlin.github.io/dataframe/info.html)
* Learn more about data visualization in Kotlin Notebook in this [YouTube video]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)
