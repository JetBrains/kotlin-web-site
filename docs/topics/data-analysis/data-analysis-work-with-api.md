[//]: # (title: Retrieve data from web sources and APIs)

Kotlin Notebook provides a powerful platform for accessing and manipulating data from various web sources and APIs.
It simplifies data extraction and analysis tasks by offering an iterative environment where every step can be visualized 
for clarity. This makes it particularly useful when exploring APIs you are not familiar with.

When used in conjunction with the [DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html), Kotlin Notebook not only enables you to connect to and fetch 
JSON data from APIs but also assists in reshaping this data for comprehensive analysis and visualization.

For an example Notebook, see [DataFrame examples on GitHub](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb).

## Before you start

1. Download and install the latest version of [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac).
2. Install the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) in IntelliJ IDEA.

   > Alternatively, access the Kotlin Notebook plugin from **Settings/Preferences** | **Plugins** | **Marketplace** within IntelliJ IDEA.
   >
   {type="tip"}

3. Create a new Kotlin Notebook by selecting **File** | **New** | **Kotlin Notebook**.
4. In the Kotlin Notebook, import the Kotlin DataFrame library by running the following command:

```kotlin
%use dataframe
```

## Fetch data from an API

Fetching data from APIs using the Kotlin Notebook with the DataFrame library is achieved through the [`.read()`](https://kotlin.github.io/dataframe/read.html) 
function, which is similar to [retrieving data from files](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file), such as CSV or JSON.
However, when working with web-based sources, you might require additional formatting to transform the raw API data into 
a structured format.

Let's look at an example of fetching data from the [YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com):

1. **Import libraries:** Import the DataFrame library, which is essential for data manipulation tasks.
This is done by running the following command in a code cell:

```kotlin
%use dataframe
```

2. **Set up API key:** Securely add your API key in a new code cell, which is necessary for authenticating requests to the YouTube Data API. 
You can obtain your API key from the [credentials tab](https://console.cloud.google.com/apis/credentials). :

```kotlin
val apiKey = "YOUR-API_KEY"
```

3. **Create a function to fetch and load data:** Create a load function that takes a path as a string and uses the DataFrame's `.read()` method to fetch data from the YouTube Data API:

```kotlin
fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
```

4. **Organize data into rows:** Organize the fetched data into rows and handle the YouTube API's pagination through the `nextPageToken`. 
This ensures you gather data across multiple pages:

```kotlin
fun load(path: String, maxPages: Int): AnyFrame {
    val rows = mutableListOf<AnyRow>()
    var pagePath = path
    do {
        val row = load(pagePath)
        rows.add(row)
        val next = row.getValueOrNull<String>("nextPageToken")
        pagePath = path + "&pageToken=" + next
    } while (next != null && rows.size < maxPages)
    return rows.concat()
}
```

5. **Create the DataFrame:** Use the previously defined `load()` function to fetch data and create a DataFrame in a new code cell. 
This example fetches data, or in this case, videos related to Kotlin, with a maximum of 50 results per page, up to a maximum of 5 pages. 
The result is stored in the `df` variable:

```kotlin
val df = load("search?q=cute%20cats&maxResults=50&part=snippet", 5)
df
```

6. **Concatenate items and display the resulting DataFrame:** Finally, extract and concatenate items from the DataFrame:

```kotlin
val items = df.items.concat()
items
```

## Clean and refine data

Cleaning and refining data are crucial steps in preparing your dataset for analysis. The [Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html) 
offers powerful functionalities for these tasks. Methods like [`.move`](https://kotlin.github.io/dataframe/move.html), 
[`.concat`](https://kotlin.github.io/dataframe/concatdf.html), [`.select`](https://kotlin.github.io/dataframe/select.html), 
[`.parse`](https://kotlin.github.io/dataframe/parse.html), and [`.join`](https://kotlin.github.io/dataframe/join.html) 
are instrumental in organizing and transforming your data. 

Let's explore an example where the data is already [fetched using YouTube's data API](#fetch-data-from-an-api).
The goal is to clean and restructure the dataset to prepare for in-depth analysis:

1. **Reorganize and clean data:**
You can start by reorganizing and cleaning your data. This involves moving certain columns under new headers and removing 
unnecessary ones for clarity:

```kotlin
val videos = items.dropNulls { id.videoId }
    .select { id.videoId named "id" and snippet }
    .distinct()
videos
```

2. **Chunk and load data:**
Chunk IDs from the cleaned data and load corresponding video statistics. This involves breaking the data into smaller 
batches and fetching additional details:

```kotlin
val statPages = clean.id.chunked(50).map {
    val ids = it.joinToString("%2C")
    load("videos?part=statistics&id=$ids")
}
statPages
```

3. **Concatenate and select relevant data:**
Concatenate the fetched statistics and select relevant columns:

```kotlin
val stats = statPages.items.concat().select { id and statistics.all() }.parse()
stats
```

4. **Join DataFrames:**
Join the existing cleaned data with the newly fetched statistics. This merges two sets of data into a comprehensive DataFrame:

```kotlin
val joined = clean.join(stats)
joined
```

This example demonstrates how to clean, reorganize, and enhance your dataset using Kotlin DataFrame's various functions. 
Each step is designed to refine the data, making it more suitable for [in-depth analysis](#analyze-data-in-kotlin-notebook).

## Analyze data in Kotlin Notebook

After you've successfully [fetched](#fetch-data-from-an-api) and [cleaned and refined your data](#clean-and-refine-data) 
using functions from the [Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html), the next step 
is to analyze this prepared dataset to extract meaningful insights.

Methods such as [`.groupBy`](https://kotlin.github.io/dataframe/groupby.html) for categorizing data, 
[`.sum`](https://kotlin.github.io/dataframe/sum.html) and [`.maxBy`](https://kotlin.github.io/dataframe/maxby.html) for 
[summary statistics](https://kotlin.github.io/dataframe/summarystatistics.html), and [`.sortBy`](https://kotlin.github.io/dataframe/sortby.html) for ordering data are particularly useful. 
These tools allow you to perform complex data analysis tasks efficiently. 

Let's look at an example, using `.groupBy` to categorize videos by channel, `.sum` to calculate total views per category, 
and `.maxBy` to find the latest or most viewed video in each group:

1. **Set up column references:** Simplify the access to specific columns by setting up references:

```kotlin
val view by column<Int>()
```

2. **Group and sort data:** Use the `.groupBy` method to group the data by the `channel` column and sort it. 

```kotlin
val channels = joined.groupBy { channel }.sortByCount()
```

In the resulting table, you can interactively explore the data. Clicking on the `group` field 
of a row corresponding to a channel will expand that row to reveal more details about that channel's videos.

You can click on the table icon in the bottom left to return to the grouped dataset.

![Expanding a row](results-of-expanding-group-data-analysis.png){width=700}

3. **Summarize and analyze data**: Use `.aggregate`, `.sum`, `.maxBy`, and `.flatten` to create a DataFrame summarizing each 
channel's total views and details of its latest or most viewed video:

```kotlin
val aggregated = channels.aggregate {
   viewCount.sum() into view

   val last = maxBy { publishedAt }
   last.title into "last title"
   last.publishedAt into "time"
   last.viewCount into "viewCount"
}.sortByDesc(view).flatten() // Sort the DataFrame in descending order by view count and transform it into a flat structure.
aggregated
```

The results of the analysis:

![Analysis results](kotlin-analysis.png){width=700}

For more advanced techniques, see the [Kotlin DataFrame documentation](https://kotlin.github.io/dataframe/gettingstarted.html).

## What's next

* Visualize data using the Kandy library
* Check out the list of supported libraries