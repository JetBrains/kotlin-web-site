[//]: # (title: Kotlin for AI-powered app development)

Kotlin provides a modern and pragmatic foundation for building AI-powered applications.  
It can be used across platforms, integrates well with established AI frameworks, and supports common AI development patterns.

## Koog

[Koog](https://koog.ai) is a JetBrains open‑source framework for building AI agents, from simple to complex.
It provides multiplatform support, Spring Boot and Ktor integrations, an idiomatic DSL,
and production‑ready features out of the box.

### Create a simple agent in a few lines

```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            // Use Anthropic, Google, OpenRouter, or any other provider
            executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```

<a href="https://www.google.com/url?q=https://docs.koog.ai/getting-started/"><img src="get-started-with-koog.svg" width="700" alt="Get started with Koog" style="block"/></a>

### Key features of Koog

* **Support for multiplatform development**. Multiplatform support enables agentic application development for JVM, JS,
    WasmJS, Android, and iOS.
* **Reliability and fault-tolerance**. With built-in retries, Koog lets developers handle failures such as timeouts or tool errors.
    And the agent persistence allows restoring full agent state machines instead of just chat messages.
* **Built-in history compression techniques for long contexts**. Koog comes with advanced strategies to compress and
    manage long-running conversations out of the box.
* **Enterprise-ready integrations**. Koog integrates with popular JVM frameworks like Spring Boot and Ktor.
* **Observability with OpenTelemetry exporters**. Koog provides out-of-the-box integration with popular observability providers
    such as W&B Weave and Langfuse for monitoring and debugging AI applications.
* **LLM switching and seamless history adaptation**. Koog allows switching to a different LLM with a new set of tools
    at any point without losing the existing conversation history.
    It also enables rerouting between multiple LLM providers, including OpenAI, Anthropic, Google, and others.
* **Integration with JVM and Kotlin applications**. Koog provides an idiomatic, type-safe DSL specifically for JVM and Kotlin developers.
* **Model Context Protocol (MCP) integration**. Koog enables the use of MCP tools in agents.
* **Knowledge retrieval and memory**. With embeddings, ranked document storage, and shared agent memory, 
    Koog enables retaining knowledge across conversations.
* **Streaming capabilities**. Koog lets developers process responses in real-time with streaming support and parallel tool calls.

### Where to start

* Explore Koog capabilities in the [Overview](https://docs.koog.ai/).
* Build your first Koog agent with the [Getting started guide](https://docs.koog.ai/single-run-agents/).
* See the latest updates in the [Koog release notes](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md).
* Learn from the [examples](https://docs.koog.ai/examples/).

## MCP Kotlin SDK

The [MCP Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk) is a Kotlin Multiplatform implementation of the Model Context Protocol (MCP) 
that lets developers build AI-powered applications in Kotlin and integrate with LLM surfaces across JVM, WebAssembly (Wasm), and iOS.

With the MCP Kotlin SDK, you can:

* Provide context for LLMs in a structured and standardized way, separating context handling from the interaction with LLMs.
* Build MCP clients that consume resources from the existing servers.
* Create MCP servers that expose prompts, tools, and resources for LLMs.
* Use standard communication transports such as stdio, SSE, and WebSocket.
* Handle all MCP protocol messages and lifecycle events.

## Explore other AI-powered application scenarios

Thanks to seamless Java interoperability and Kotlin Multiplatform, you can combine Kotlin with established AI SDKs and frameworks,
build backend and desktop/mobile UIs, and adopt patterns like RAG and agent‑based workflows.

> You can explore and run examples from the [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) repository.
> Each project is self-contained. You can use each project as a reference or template for building Kotlin-based AI applications.

### Connect to major model providers

Use Kotlin to connect to major model providers such as OpenAI, Anthropic, Google, and others:

* [OpenAI](https://github.com/openai/openai-java) — official Java SDK for the OpenAI API. It covers responses and chat, images, and audio.
* [Anthropic (Claude)](https://github.com/anthropics/anthropic-sdk-java) — official Java SDK for the Claude Messages API. It includes modules for Vertex AI and Bedrock integrations. 
* [Google AI (Gemini / Vertex AI)](https://github.com/googleapis/java-genai) — official Java SDK with a single client that switches between Gemini API and Vertex AI.
* [Azure OpenAI](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) — official Java client for Azure OpenAI Service. It supports chat completions and embeddings.
* [AWS Bedrock](https://github.com/aws/aws-sdk-kotlin) — official SDKs to invoke foundation models. It includes the Kotlin SDK and Java SDK for Bedrock and Bedrock Runtime.

### Create retrieval-augmented generation (RAG) piplelines and agent-based apps

* [Spring AI](https://github.com/spring-projects/spring-ai) — multi-provider abstraction for prompts, chat, embeddings, tools and function calling, and vector stores.
* [LangChain4j](https://docs.langchain4j.dev/tutorials/kotlin/) — JVM toolkit with Kotlin extensions for prompts, tools, RAG pipelines, and agents.

## What's next

* Complete the [Build a Kotlin app that uses Spring AI to answer questions based on documents stored in the Qdrant](spring-ai-guide.md)
  tutorial to learn more about using Spring AI with Kotlin in IntelliJ IDEA
* Join the [Kotlin community](https://kotlinlang.org/community/) to connect with other developers building AI applications with Kotlin