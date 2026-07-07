[//]: # (title: AI-powered Kotlin development)

AI-powered tools can assist with many Kotlin development tasks, from small code suggestions to larger implementation work.
For example, you can use AI to generate Kotlin code, explain unfamiliar APIs, create tests, write documentation,
review changes, and perform refactorings.

This page explains the AI-powered tools available for Kotlin development and how to choose the right workflow.

## AI Assistant

[AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant) provides AI-powered assistance directly in JetBrains IDEs.
It is useful for focused, interactive tasks where you want to stay in control of each change.

Use AI Assistant when you want to ask questions about your project, explain existing Kotlin code,
generate a code fragment, create KDoc, write tests, suggest refactorings, or summarize changes. 
Because AI Assistant works inside the IDE, it can be used together with Kotlin-aware features
such as code completion, navigation, inspections, and refactorings.

> Learn more about [AI assistant integration with JetBrains IDEs](https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html).
>
{style="tip"}

## Junie

[Junie](https://www.jetbrains.com/junie/) is a JetBrains AI coding agent. It is deeply integrated into JetBrains IDEs and can use the running IDE engine.

Junie is designed for tasks that require more than a single code suggestion or chat response.
You can ask it to implement a feature, update code across multiple files, add tests, or perform maintenance work.
Junie can plan the work, explore the project, write code, run tests when needed, and present the result for review.

Because Junie works with IDE capabilities such as refactoring, debugging, and framework-aware navigation,
it can handle Kotlin projects with more context than tools that only read and write files.

## JetBrains Air

JetBrains Air is an agentic development environment for delegating coding tasks to multiple AI agents
and running them concurrently.

Use JetBrains Air when you want several agents to work on tasks at the same time while
keeping each task isolated from the main codebase. This is useful for experimentation, parallel implementation attempts,
comparing agent output, or assigning different tasks to different agents.

Air provides a desktop experience for defining, planning, reviewing, and iterating on complex development tasks.
Agents can run locally or in isolated environments such as Docker containers and Git worktrees.
Depending on your setup, you can use a JetBrains AI subscription or your AI provider’s API keys.

## JetBrains Central

JetBrains Central is an open platform for agent-driven software development across teams.
It connects tools, agents, and infrastructure so that automated work can be run, monitored, and managed in one place.

Use JetBrains Central when AI-assisted development needs to move beyond individual coding sessions.
For teams and organizations, the challenge is not only generating code, but also managing visibility, cost,
performance, results, and governance across many agent-driven tasks.

JetBrains Central helps organizations coordinate AI agents as part of software production rather than treating them
as isolated developer tools.

## Agent Client Protocol

Agent Client Protocol (ACP) is an open protocol for connecting AI coding agents to IDEs and code editors.
Instead of requiring a separate integration for every agent and editor combination,
ACP standardizes how agents and clients communicate.

JetBrains IDEs support ACP, so you can use ACP-compatible agents from within the IDE.
This is useful when you want flexibility in choosing AI agents while continuing to work with
Kotlin-aware IDE features such as navigation, inspections, refactorings, and project analysis.
The registry provides access to multiple agents, including Claude Agent, Cursor, GitHub Copilot, OpenCode, and others.

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

## DPAI Arena

DPAI Arena is an open benchmarking platform for evaluating AI coding agents on real-world software engineering tasks.
It is designed to support multiple languages, frameworks, and development workflows.

Use DPAI Arena when you need evidence about how AI coding agents perform on realistic development tasks.
Benchmark results can help teams compare tools, evaluate improvements, and make more informed
decisions about agent adoption.

## Kotlin AI Skills

Kotlin AI Skills are reusable instructions that you provide to an AI agent.
They are not IDE features and are not agents themselves. Instead, they help an agent perform Kotlin development
tasks more consistently.

Use Kotlin AI Skills when you want to guide an agent toward idiomatic Kotlin patterns,
Kotlin coding conventions, and project-specific expectations. Skills can support tasks such as writing Kotlin code,
explaining language features, generating documentation, creating tests, reviewing code, or applying migration guidance.

Kotlin AI Skills can be used with different agents and workflows, including IDE-based agents,
command-line agents, and external AI tools that support reusable instructions.

## Third-party AI tools

Many third-party AI development tools support Kotlin. These tools may be available as IDE extensions,
standalone editors, command-line agents, or cloud-based development environments. For example:

* GitHub Copilot
* Google Gemini
* Claude Code
* OpenAI Codex
* and many more

Choose a third-party tool if it matches your preferred development environment or offers capabilities that fit your workflow.
Many of these tools support Kotlin code generation, explanations, test creation, and refactoring.

You can use third-party tools independently, or connect compatible agents to JetBrains IDEs through ACP.

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