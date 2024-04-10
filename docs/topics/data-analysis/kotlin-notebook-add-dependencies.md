[//]: # (title: Add dependencies to your Kotlin Notebook)

<microformat>
   <p>This is the third part of the <strong>Getting started with Kotlin Notebook</strong> tutorial. Before proceeding, make sure you've completed the previous step.</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">Set up an environment</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">Create a Kotlin Notebook</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>Add dependencies to a Kotlin Notebook</strong><br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Share a Kotlin Notebook<br/>
  </p>
</microformat>

You've already created your first Kotlin Notebook! Now let's learn how to add dependencies to libraries, which
is necessary to unlock advanced features.

> The Kotlin Standard Library can be used out of the box, so you don't have to import it.
> 
{type="note"}

You can load any library from the Maven repository by specifying its coordinates using Gradle-style
syntax in any code cell. 
However, Kotlin Notebook has a simplified method to load popular libraries in the form of the `%use` statement:

```kotlin
// Replace libraryName with the library dependency you want to add
%use libraryName
```

You can also use the autocompletion feature in Kotlin Notebook to quickly access available libraries.
![Autocompletion feature in Kotlin Notebook](autocompletion-feature-notebook.png){width=700}

## Add Kotlin DataFrame and Kandy libraries to your Kotlin Notebook

Let's add two popular Kotlin library dependencies to your Kotlin Notebook:
* The [Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html) gives you the power to manipulate data in your Kotlin projects. 
You can use it to retrieve data from [APIs](data-analysis-work-with-api.md), [SQL databases](data-analysis-connect-to-db.md), and [various file formats](data-analysis-work-with-data-sources.md), such as CSV or JSON.
* The [Kandy library](https://kotlin.github.io/kandy/welcome.html) provides a powerful and flexible DSL for [creating charts](data-analysis-visualization.md).

To add these libraries:

1. Click **Add Code Cell** to create a new code cell.
2. Enter the following code in the code cell:

```kotlin
// Ensures that we use the latest available versions of libraries
%useLatestDescriptors 

// Imports the Kotlin DataFrame library
%use dataframe

// Imports the Kotlin Kandy library
%use kandy
```

3. Run the code cell.

When a `%use` statement is executed, it downloads the library dependencies and adds the default imports to your notebook.

> Make sure to run the code cell with the `%use libraryName` line before you run any other code cells that rely on the 
> library.
> 
{type="note"}

4. To import data from a CSV file using the Kotlin DataFrame library, use the `.read()` function in a new code cell:

```kotlin
// Creates a DataFrame by importing data from the "netflix_titles.csv" file.
val rawDf = DataFrame.read("netflix_titles.csv")

// Displays the raw DataFrame data
rawDf
```

> You can download and add this example CSV to your project from the [Kotlin DataFrame examples GitHub repository](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv).
> 
{type="tip"}

![Using DataFrame to display data](add-dataframe-dependency.png){width=700}

5. In a new code cell, use the `.plot` method to visually represent the distribution of TV shows and Movies in your DataFrame.:

```kotlin
rawDf
    // Counts the occurrences of each unique value in the column named "type"
    .valueCounts(sort = false) { type }
    // Visualizes data in a bar chart specifying the colors
    .plot {
        bars {
            x(type)
            y("count")
            fillColor(type) {
                scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
            }
        }

        // Configures the layout of the chart and sets the title
        layout {
            title = "Count of TV Shows and Movies"
            size = 900 to 550
        }
    }
```

The resulting chart:

![Visualization using the Kandy library](kandy-library.png){width=700}

Congratulations on adding and utilizing these libraries in your Kotlin Notebook!
This is just a glimpse into what you can achieve with Kotlin Notebook and its [supported libraries](data-science-libraries.md).

For a more extensive guide using the Kotlin DataFrame library, see 
[Retrieve data from files](data-analysis-work-with-data-sources.md), and explore [Data visualization in Kotlin Notebook with Kandy](data-analysis-visualization.md) for advanced data visualization.

## Next step

In the next part of the tutorial, you will learn how to share a Kotlin Notebook.

**[Proceed to the next chapter](kotlin-notebook-share.md)**
