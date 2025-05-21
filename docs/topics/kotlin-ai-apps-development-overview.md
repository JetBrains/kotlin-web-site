[//]: # (title: Kotlin for AI-powered apps development)

Kotlin provides a modern and pragmatic foundation for building AI-powered applications.
It can be used across platforms, integrates well with established AI frameworks, and supports common AI development patterns.

This page introduces how Kotlin is used in real-world AI scenarios with working examples from the [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) repository.

## Kotlin AI agentic framework – Koog

[Koog](https://github.com/JetBrains/koog) is a Kotlin-based framework for creating and running AI agents locally without requiring external services.
Koog is JetBrains’ innovative, open-source agentic framework that empowers developers to build AI agents within the JVM ecosystem
It provides a pure Kotlin implementation for building intelligent agents that can interact with tools, handle complex workflows, and communicate with users.

## Other use cases

### Retrieval-augmented generation (RAG)

Use Kotlin to build RAG pipelines that connect language models to external sources like documentation, vector stores, or APIs:

* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo):
   A Spring Boot app that loads Kotlin standard library docs into a vector store and supports document-based Q&A.
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot):
   A minimal RAG example using LangChain4j.

### Agent-based applications

Build AI agents in Kotlin that reason, plan, and act using language models and tools:

* [`koog`](https://github.com/JetBrains/koog): 
  Shows how to use Kotlin agentic framework Koog to build AI agents.
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot):
   Includes a simple tool-using agent built with LangChain4j.

### Chain of thought prompting

Implement structured prompting techniques that guide language models through multi-step reasoning.

* [`LangChain4j_Overview.ipynb`](https://github.com/Kotlin/Kotlin-AI-Examples/blob/master/notebooks/langchain4j/LangChain4j_Overview.ipynb):
   A Kotlin Jupyter notebook demonstrating chain of thought and structured output.

### LLMs in backend services

Integrate LLMs into business logic or REST APIs using Kotlin and Spring:

* [`spring-ai-examples`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/spring-ai-examples):
   Includes classification, chat, and summarization examples.
* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo):
   Demonstrates full integration of LLM responses with application logic.

### Multiplatform user interfaces with AI

Use Compose Multiplatform to build interactive AI-powered UIs in Kotlin:

* [`mcp-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/mcp/mcp-demo):
   A desktop UI that connects to Claude and OpenAI and presents responses using Compose Multiplatform.

## Technologies

The examples use:

* [LangChain4j](https://github.com/langchain4j/langchain4j) – building blocks for LLM applications in Kotlin and Java
* [Spring AI](https://spring.io/projects/spring-ai) – AI integration for Spring applications
* [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) – declarative UI for Kotlin apps across platforms
* [OpenAI](https://platform.openai.com/) and [Claude](https://claude.ai/) – language model APIs
* [Qdrant](https://qdrant.tech/) and [Weaviate](https://weaviate.io/) – vector search databases

## Explore the examples

You can explore and run the examples from the [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) repository.
Each project is self-contained and can be used as a reference or template for building Kotlin-based AI applications.

## What's next

* Follow the []
* Explore [LangChain4j](https://github.com/langchain4j/langchain4j) for building LLM-powered applications in Kotlin and Java
* Learn about [Spring AI](https://spring.io/projects/spring-ai) for integrating AI capabilities into Spring applications
* Check out [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) for building cross-platform UIs for AI applications
* Discover [Kotlin Multiplatform](multiplatform.topic) for sharing AI-related code across platforms
* Join the [Kotlin community](https://kotlinlang.org/community/) to connect with other developers building AI applications with Kotlin