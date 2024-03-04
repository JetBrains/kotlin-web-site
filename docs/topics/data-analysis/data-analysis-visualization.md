[//]: # (title: Data visualization in Kotlin Notebook with Kandy)

Kotlin offers an all-in-one-place solution for powerful and flexible data visualization, providing an intuitive way to present and explore data 
before diving into complex models.

This tutorial demonstrates how to create different chart types in IntelliJ IDEA using the Kotlin Notebook plugin with
the [Kandy](https://kotlin.github.io/kandy/welcome.html) and [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) libraries.

## Before you start

1. Download and install the latest version of [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac).
2. Install the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) in IntelliJ IDEA.
   
    > Alternatively, access the Kotlin Notebook plugin from **Settings/Preferences** | **Plugins** | **Marketplace** within IntelliJ IDEA.
    >
    {type="tip"}

3. Create a new Kotlin Notebook by selecting **File** | **New** | **Kotlin Notebook**.
4. In the Kotlin Notebook, import the Kandy and Kotlin DataFrame libraries by running the following command:

    ```kotlin
    %use kandy
    %use dataframe
    ```

## Create the data frame

Start by creating the data frame containing the records to visualize. This data frame stores simulated numbers of the 
monthly average temperature in three cities: Berlin, Madrid, and Caracas.

Use the `dataFrameOf()` function from the Kotlin DataFrame library
to generate the data frame. To create the data frame, run the following code snippet in the Kotlin Notebook:

```kotlin
// The months variable stores a list with the 12 months of the year
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

// The df variable stores a data frame of three columns, including records of months, temperature, and cities
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

Explore the structure of the new data frame by looking into the first four rows:

```kotlin
df.head(4)
```

You can see that the data frame has three columns: Month, Temperature, and City. 
The first four rows of the data frame contain records of the temperature in Berlin from January to April:

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

> Find more information about creating, exploring, and managing data frames in the [Kotlin DataFrame library documentation](https://kotlin.github.io/dataframe/info.html).
> 
> To learn about retrieving data from files, web sources, or databases, see [Working with data sources](data-analysis-work-with-data-sources.md).
> 
{type="note"}

## Create a line chart

Let's create a line chart with the `df` data frame in the Kotlin Notebook.

Use the `plot()` function from the Kandy library. Within the `plot()` function, specify the type of chart (in this case, it's `line`) 
and the values for the X and Y axes. You can customize colors and sizes:

```kotlin
df.plot {
    line {
        // Accesses the data frame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the data frame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // Customizes the line's size
        width = 1.5
    }
    // Customizes the chart's layout size
    layout.size = 1000 to 450
}
```

Here's the result:

![Line chart](visualization-line-chart.svg){width=600}

## Create a points chart

Now, let's visualize the `df` data frame in a points (scatter) chart. 

Within the `plot()` function, specify the `points` chart type. Add the X and Y axes' values and the categorical values from the `df` columns.
You can also include a heading to your chart:

```kotlin
df.plot {
    points {
        // Accesses the data frame's columns used for the X and Y axes 
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // Customizes the point's size
        size = 5.5
        // Accesses the data frame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // Adds a chart heading
    layout.title = "Temperature per month"
}
```

Here's the result:

![Points chart](visualization-points-chart.svg){width=600}

## Create a bar chart

Finally, let's create a bar chart grouped by city using the same data as in the previous charts. 
For colors, you can also use hexadecimal codes: 

```kotlin
// Groups by cities  
df.groupBy { City }.plot {
    // Adds a chart heading
    layout.title = "Temperature per month"
    bars {
        // Accesses the data frame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the data frame's column used for categories and sets colors for these categories 
        fillColor(City) {
            scale = categorical(
                "Berlin" to Color.hex("#6F4E37"),
                "Madrid" to Color.hex("#C2D4AB"),
                "Caracas" to Color.hex("#B5651D")
            )
        }
    }
}
```

Here's the result:

![Bar chart](visualization-bar-chart.svg){width=600}

<p>&nbsp;</p>

> To increase type safety, there are different options to access a column's records when working with the Kandy and Kotlin DataFrame libraries together.
> For more information about options to access columns, see [Access APIs](https://kotlin.github.io/dataframe/apilevels.html).
>
{type="tip"}


## What's next

* Explore more chart examples in the [Kandy documentation](https://kotlin.github.io/kandy/examples.html).
* Learn more about data visualization in Kotlin Notebook in this [YouTube video]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s).
