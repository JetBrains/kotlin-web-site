[//]: # (title: AI-powered Kotlin development)

AI-powered development tools can help you work more efficiently throughout the software development lifecycle.
Depending on your workflow, you can use AI to generate code, understand unfamiliar APIs,
refactor existing implementations, create tests and documentation,
or automate larger development tasks.

The Kotlin ecosystem supports several approaches to AI-assisted development.
Some tools are integrated directly into JetBrains IDEs, while others work as external coding agents.
You can also provide AI agents with Kotlin-specific knowledge through [AI Skills](kotlin-ai-skills.md)
to improve the quality and consistency of generated code.

This page introduces the available tools and explains when to use each one.

## AI Assistant

[AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant) is an AI-powered assistant
integrated into JetBrains IDEs. It provides contextual assistance while you work with Kotlin code and has
access to your project through the IDE.

Use AI Assistant when you need help with individual development tasks without leaving your IDE.
For example, it can explain unfamiliar code, generate documentation, suggest refactorings,
create tests, or answer questions about APIs. Because it works directly inside the IDE,
it can use project context to provide more relevant suggestions than a standalone chatbot.

AI Assistant works alongside you as you develop.
You decide which suggestions to accept, modify, or discard before applying them to your code.

> Learn more about [AI assistant integration with JetBrains IDEs](https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html).
>
{style="tip"}

## Junie

[Junie](https://www.jetbrains.com/junie/) is an AI coding agent for JetBrains IDEs that
can perform multistep development tasks involving multiple files.

Use Junie when a task is too large for a single prompt, such as implementing a feature,
updating an API across a project, or generating tests for an existing module.
Junie can plan and execute a sequence of actions instead of responding only to individual requests.

Describe the task you want to accomplish, let Junie perform the implementation, then review,
test, and validate the proposed changes before accepting them.

## MCP server

[MCP server](https://plugins.jetbrains.com/plugin/26071-mcp-server?_cl=MTsxOzE7YlUyZlBIVDFjak9DRk54bnhZOE15MDFLbFRCNVVNSzRQQjlrRXdJZk5XS1NleExxemEwTFlzYlVNYTZLVkZaMzs%3D&_gl=1%2A1ro96c%2A_gcl_au%2AMTM4MzA2MTQ5OC4xNzgxMDg2MDUx%2AFPAU%2AMTM4MzA2MTQ5OC4xNzgxMDg2MDUx%2A_ga%2AOTI3NzQ3NDc1LjE3NzI0NTYwNzM.%2A_ga_9J976DJZ68%2AczE3ODIzNzg5OTUkbzM5JGcxJHQxNzgyMzc5NDIwJGoxMyRsMCRoMA..) 
exposes IDE capabilities through the Model Context Protocol (MCP),
allowing compatible AI agents to interact with your JetBrains IDE.

Without MCP, an external AI agent can usually access only your project files.
Through MCP, the agent can also use IDE capabilities such as project indexing,
code navigation, refactoring, inspections, and build execution.
This gives external AI tools a better understanding of your Kotlin project.

If you prefer using an external AI agent such as Claude Code or Cursor, connect it to your JetBrains IDE through
the MCP server so it can use the IDE’s Kotlin language intelligence while performing development tasks.

> Learn more about [MCP server integration with JetBrains IDEs](https://www.jetbrains.com/help/idea/mcp-server.html).
> 
{style="tip"}

## Third-party AI tools

Many external AI development tools support Kotlin, including:

* GitHub Copilot
* Google Gemini
* Claude Code
* OpenAI Codex
* and many more

These tools may be available as IDE extensions, standalone editors, or command-line agents.

Choose a third-party tool if it matches your preferred development environment or offers capabilities that fit your workflow.
Many of these tools support Kotlin code generation, explanations, test creation, and refactoring.

Some third-party tools work independently, while others can connect to JetBrains IDEs
through the MCP server to access additional Kotlin-aware IDE capabilities.

## Typical workflows

The following examples show how these tools can be used together.

### Develop entirely in JetBrains IDEs

Use:

* AI Assistant for code generation and explanations.
* Junie for larger implementation tasks.

### Use an external AI agent with your IDE

Use:

* An AI agent such as Claude Code or Cursor.
* The JetBrains MCP server to provide access to your IDE.
* Kotlin AI Skills to improve Kotlin-specific responses.

### Build Kotlin applications with AI assistance

A typical workflow might include:

1. Use an AI agent to plan or implement a feature.
2. Provide Kotlin AI Skills to guide the agent.
3. Connect the agent to your IDE through the MCP server.
4. Review and refine the generated code with AI Assistant or standard IDE inspections.