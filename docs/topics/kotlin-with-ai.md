[//]: # (title: Kotlin with AI)

Kotlin supports AI-related workflows in two ways:

* [Use Kotlin to build AI-powered applications](#build-ai-powered-apps-with-kotlin)
* [Use AI to assist with Kotlin development](#ai-for-kotlin-development)

You can use these capabilities independently or combine them in the same project.
This page explains both options and helps you decide which to use.

## Build AI-powered apps with Kotlin

Use Kotlin to create applications that use AI capabilities.

The Kotlin ecosystem provide libraries, frameworks, and integrations for working
with AI services and models across different platforms. 

To learn how to build AI-powered applications with Kotlin, see:

* [](kotlin-ai-apps-development-overview.md)
* [](spring-ai-guide.md)

## AI for Kotlin development

AI-powered development tools can help you write, test, and maintain your Kotlin code.

Kotlin supports AI-assisted development through IDE integrations, reusable AI Skills,
and third-party AI tools.

### AI tools in JetBrains IDEs

JetBrains IDEs provide several AI-powered tools for Kotlin development:

* [Junie](https://www.jetbrains.com/junie/) – An AI coding agent that can perform multistep development tasks, such as implementing features,
  refactor code across multiple files, and creating tests.
* [AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant) – Generate, explain, and refactor Kotlin code,
  create documentation and tests, and ask questions about your project without leaving the IDE.
* JetBrains Air
* JetBrains Central
* Agent Client Protocol
* DPAI Arena
* [MCP server](https://plugins.jetbrains.com/plugin/26071-mcp-server?_cl=MTsxOzE7YlUyZlBIVDFjak9DRk54bnhZOE15MDFLbFRCNVVNSzRQQjlrRXdJZk5XS1NleExxemEwTFlzYlVNYTZLVkZaMzs%3D&_gl=1%2A1ro96c%2A_gcl_au%2AMTM4MzA2MTQ5OC4xNzgxMDg2MDUx%2AFPAU%2AMTM4MzA2MTQ5OC4xNzgxMDg2MDUx%2A_ga%2AOTI3NzQ3NDc1LjE3NzI0NTYwNzM.%2A_ga_9J976DJZ68%2AczE3ODIzNzg5OTUkbzM5JGcxJHQxNzgyMzc5NDIwJGoxMyRsMCRoMA..) -
  Exposes IDE capabilities through the Model Context Protocol (MCP), allowing compatible AI agents to interact with your project, navigate code, perform refactorings, run builds and tests, and use other IDE features.

> See [AI-powered Kotlin development](ai-for-development.md) for an overview of these tools
> and how to use them.
> 
{style="tip"}

### Kotlin AI Skills

Kotlin AI Skills are reusable, task-specific instructions that help AI agents perform Kotlin development tasks consistently.

You can provide AI Skills to compatible AI agents to improve tasks such as:

* Explain Kotlin code
* Write tests
* Migrate APIs
* Applying Kotlin best practices

> Learn more about [](kotlin-ai-skills.md).
> 
{style="tip"}

### Third-party AI tools

Many AI development tools support Kotlin, including:

* GitHub Copilot
* Google Gemini
* Claude Code
* OpenAI Codex
* and many more

Some of these tools integrate with JetBrains IDEs through the Agent Client Protocol (ACP), 
while others provide their own IDEs, editor extensions, or command-line interfaces.

> Learn more about [AI tools](ai-for-development.md) that support Kotlin development.
> 
{style="tip"}