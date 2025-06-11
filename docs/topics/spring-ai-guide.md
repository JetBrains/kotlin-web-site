[//]: # (title: Build a Kotlin app that uses Spring AI to answer questions based on documents stored in Qdrant — tutorial)

In this tutorial, you'll learn how to build a Kotlin app that uses [Spring AI](https://spring.io/projects/spring-ai) to connect to an LLM,
store documents in a vector database, and answer questions using context from those documents.

You will use the following tools during this tutorial:

* [Spring Boot](https://spring.io/projects/spring-boot) as the base to configure and run the web application.
* [Spring AI](https://spring.io/projects/spring-ai) to interact with the LLM and perform context-based retrieval.
* [IntelliJ IDEA](https://www.jetbrains.com/idea/) to generate the project and implement the application logic.
* [Qdrant](https://qdrant.tech/) as the vector database for similarity search.
* [Docker](https://www.docker.com/) to run Qdrant locally.
* [OpenAI](https://platform.openai.com) as the LLM provider.

## Before you start

1. Download and install the latest version of [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html).

    > If you use IntelliJ IDEA Community Edition or another IDE, you can generate a Spring Boot project using
    > a [web-based project generator](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin).
    >
    {style="tip"}

2. Create an OpenAI API key on the [OpenAI platform](https://platform.openai.com/api-keys) to access the API.
3. Install [Docker](https://www.docker.com/) to run the Qdrant vector database locally.
4. After installing Docker, open your terminal and run the following command to start the container:

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## Create the project

> You can use [Spring Boot web-based project generator](https://start.spring.io/) as an alternative to generate your project.
>
{style="note"}

Create a new Spring Boot project in IntelliJ IDEA Ultimate Edition:

1. In IntelliJ IDEA, select **File** | **New** | **Project**.
2. In the panel on the left, select **New Project** | **Spring Boot**.
3. Specify the following fields and options in the **New Project** window:

    * **Name**: springAIDemo
    * **Language**: Kotlin
    * **Type**: Gradle - Kotlin

      > This option specifies the build system and the DSL.
      >
      {style="tip"}

    * **Package name**: com.example.springaidemo
    * **JDK**: Java JDK

      > This tutorial uses **Oracle OpenJDK version 21.0.1**.
      > If you don't have a JDK installed, you can download it from the dropdown list.
      >
      {style="note"}

    * **Java**: 17

   ![Create Spring Boot project](create-spring-ai-project.png){width=800}

4. Make sure that you have specified all the fields and click **Next**.
5. Select the latest stable Spring Boot version in the **Spring Boot** field.

6. Select the following dependencies required for this tutorial:

    * **Web | Spring Web**
    * **AI | OpenAI**
    * **SQL | Qdrant Vector Database**

   ![Set up Spring Boot project](spring-ai-dependencies.png){width=800}

7. Click **Create** to generate and set up the project.

   > The IDE will generate and open a new project. It may take some time to download and import the project dependencies.
   >
   {style="tip"}

After this, you can see the following structure in the **Project view**:

![Spring Boot project view](spring-ai-project-view.png){width=400}

The generated Gradle project corresponds to the Maven's standard directory layout:

* There are packages and classes under the `main/kotlin` folder that belong to the application.
* The entry point to the application is the `main()` method of the `SpringAiDemoApplication.kt` file.


## Update the project configuration

1. Update your `build.gradle.kts` Gradle build file with the following:

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // Rest of the plugins
    }
   ```

2. Set `springAiVersion` to `1.0.0`:

   ```kotlin
   extra["springAiVersion"] = "1.0.0"
   ```

3. Click the **Sync Gradle Changes** button to synchronize the Gradle files.
4. Update your `src/main/resources/application.properties` file with the following:

   ```text
   # OpenAI
   spring.ai.openai.api-key=YOUR_OPENAI_API_KEY
   spring.ai.openai.chat.options.model=gpt-4o-mini
   spring.ai.openai.embedding.options.model=text-embedding-ada-002
   # Qdrant
   spring.ai.vectorstore.qdrant.host=localhost
   spring.ai.vectorstore.qdrant.port=6334
   spring.ai.vectorstore.qdrant.collection-name=kotlinDocs
   spring.ai.vectorstore.qdrant.initialize-schema=true
   ```
   
   > Set your OpenAI API key to the `spring.ai.openai.api-key` property.
   > 
   {style="note"}

5. Run the `SpringAiDemoApplication.kt` file to start the Spring Boot application.
   Once it's running, open the [Qdrant collections](http://localhost:6333/dashboard#/collections) page in your browser to see the result:

   ![Qdrant collections](qdrant-collections.png){width=700}

## Create a controller to load and search documents

Create a Spring `@RestController` to search documents and store them in the Qdrant collection:

1. In the `src/main/kotlin/org/example/springaidemo` directory, create a new file named `KotlinSTDController.kt`, and add the following code:

    ```kotlin
    package org.example.springaidemo
    
    // Imports the required Spring and utility classes
    import org.slf4j.LoggerFactory
    import org.springframework.ai.document.Document
    import org.springframework.ai.vectorstore.SearchRequest
    import org.springframework.ai.vectorstore.VectorStore
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.PostMapping
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RequestParam
    import org.springframework.web.bind.annotation.RestController
    import org.springframework.web.client.RestTemplate
    import kotlin.uuid.ExperimentalUuidApi
    import kotlin.uuid.Uuid

    @RestController
    @RequestMapping("/kotlin")
    class KotlinSTDController(
    private val restTemplate: RestTemplate,
    private val vectorStore: VectorStore,
    ) {
    private val logger = LoggerFactory.getLogger(this::class.java)

        @OptIn(ExperimentalUuidApi::class)
        @PostMapping("/load-docs")
        fun load() {
            // Loads a list of documents from the Kotlin documentation
            val kotlinStdTopics = listOf(
                "collections-overview", "constructing-collections", "iterators", "ranges", "sequences",
                "collection-operations", "collection-transformations", "collection-filtering", "collection-plus-minus",
                "collection-grouping", "collection-parts", "collection-elements", "collection-ordering",
                "collection-aggregate", "collection-write", "list-operations", "set-operations",
                "map-operations", "read-standard-input", "opt-in-requirements", "scope-functions", "time-measurement",
            )
            // Base URL for the documents
            val url = "https://raw.githubusercontent.com/JetBrains/kotlin-web-site/refs/heads/master/docs/topics/"
            // Retrieves each document from the URL and adds it to the vector store
            kotlinStdTopics.forEach { topic ->
                val data = restTemplate.getForObject("$url$topic.md", String::class.java)
                data?.let { it ->
                    val doc = Document.builder()
                        // Builds a document with a random UUID
                        .id(Uuid.random().toString())
                        .text(it)
                        .metadata("topic", topic)
                        .build()
                    vectorStore.add(listOf(doc))
                    logger.info("Document $topic loaded.")
                } ?: logger.warn("Failed to load document for topic: $topic")
            }
        }

        @GetMapping("docs")
        fun query(
            @RequestParam query: String = "operations, filtering, and transformations",
            @RequestParam topK: Int = 2
        ): List<Document>? {
            val searchRequest = SearchRequest.builder()
                .query(query)
                .topK(topK)
                .build()
            val results = vectorStore.similaritySearch(searchRequest)
            logger.info("Found ${results?.size ?: 0} documents for query: '$query'")
            return results
        }
    }
    ```
   {collapsible="true"}

2. Update the `SpringAiDemoApplication.kt` file to declare a `RestTemplate` bean:

   ```kotlin
   package org.example.springaidemo
   
   import org.springframework.boot.autoconfigure.SpringBootApplication
   import org.springframework.boot.runApplication
   import org.springframework.context.annotation.Bean
   import org.springframework.web.client.RestTemplate
   
   @SpringBootApplication
   class SpringAiDemoApplication {
   
       @Bean
       fun restTemplate(): RestTemplate = RestTemplate()
   }
   
   fun main(args: Array<String>) {
       runApplication<SpringAiDemoApplication>(*args)
   }
   ```
   {collapsible="true"}

3. Run the application.
4. In the terminal, send a POST request to the `/kotlin/load-docs` endpoint to load the documents:

   ```bash
   curl -X POST http://localhost:8080/kotlin/load-docs
   ```

5. Once the documents are loaded, you can search for them with a GET request:

   ```Bash
   curl -X GET http://localhost:8080/kotlin/docs
   ```

   ![GET request results](spring-ai-get-results.png){width="700"}

> You can also view the results on the [Qdrant collections](http://localhost:6333/dashboard#/collections) page.
> 
{style="tip"}

## Implement an AI chat endpoint

Once the documents are loaded, the final step is to add an endpoint that answers questions using the documents in Qdrant through Spring AI's Retrieval-Augmented Generation (RAG) support:

1. Open the `KotlinSTDController.kt` file, and import the following classes:

   ```kotlin
   import org.springframework.ai.chat.client.ChatClient
   import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor
   import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor
   import org.springframework.ai.chat.prompt.Prompt
   import org.springframework.ai.chat.prompt.PromptTemplate
   import org.springframework.web.bind.annotation.RequestBody
   ```

2. Define a `ChatRequest` data class:

   ```kotlin
   // Represents the request payload for chat queries
   data class ChatRequest(val query: String, val topK: Int = 3)
   ```

3. Add `ChatClient.Builder` to the controller's constructor parameters:

   ```kotlin
   class KotlinSTDController(
       private val chatClientBuilder: ChatClient.Builder,
       private val restTemplate: RestTemplate,
       private val vectorStore: VectorStore,
   )
   ```

4. Inside the controller class, create a `ChatClient` instance:

   ```kotlin
   // Builds the chat client with a simple logging advisor
   private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
   ```

5. At the bottom of your `KotlinSTDController.kt` file, add a new `chatAsk()` endpoint, with the following logic:

   ```kotlin
    @PostMapping("/chat/ask")
    fun chatAsk(@RequestBody request: ChatRequest): String? {
        // Defines the prompt template with placeholders
        val promptTemplate = PromptTemplate(
            """
            {query}.
            Please provide a concise answer based on the "Kotlin standard library" documentation.
        """.trimIndent()
        )

        // Creates the prompt by substituting placeholders with actual values
        val prompt: Prompt =
            promptTemplate.create(mapOf("query" to request.query))

        // Configures the retrieval advisor to augment the query with relevant documents
        val retrievalAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
            .searchRequest(
                SearchRequest.builder()
                    .similarityThreshold(0.7)
                    .topK(request.topK)
                    .build()
            )
            .promptTemplate(promptTemplate)
            .build()

        // Sends the prompt to the LLM with the retrieval advisor and retrieves the generated content
        val response = chatClient.prompt(prompt)
            .advisors(retrievalAdvisor)
            .call()
            .content()
        logger.info("Chat response generated for query: '${request.query}'")
        return response
    }
   ```

6. Run the application.
7. In the terminal, send a POST request to the new endpoint to see the results:

   ```bash
   curl -X POST "http://localhost:8080/kotlin/chat/ask" \
        -H "Content-Type: application/json" \
        -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
   ```

   ![OpenAI answer to chat request](open-ai-chat-endpoint.png){width="700"}

Congratulations! You now have a Kotlin app that connects to OpenAI and answers questions using context retrieved from
documentation stored in Qdrant.
Try experimenting with different queries or importing other documents to explore more possibilities.

You can view the completed project in the [Spring AI demo GitHub repository](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo), 
or explore other Spring AI examples in [Kotlin AI Examples](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master).
