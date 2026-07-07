[//]: # (title: AI tools)

AI-powered tools can assist with many Kotlin development tasks, from small code suggestions to larger implementation work.
For example, you can use AI to generate Kotlin code, explain unfamiliar APIs, create tests, write documentation,
review changes, and perform refactorings.

Depending on how you work, you can start in one of three places:

* [Within the IDE](#within-the-ide): Use AI features directly in your JetBrains IDE, including AI Assistant, AI agents through ACP, and the MCP server for connecting external agents to IDE capabilities.
* [AI agents](#ai-agents): Choose an AI coding agent such as Junie or a third-party agent, and improve its Kotlin expertise with Kotlin AI skills.
* [Manage AI agents](#manage-ai-agents): Coordinate, evaluate, and manage AI agents at a larger scale with tools such as JetBrains Air, JetBrains Central, and DPAI Arena.

The following sections explain these tools and when to use each one.

## Within the IDE

### AI Assistant

The [AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant) provides AI-powered assistance directly in JetBrains IDEs.
It's useful for focused, interactive tasks where you want to stay in control of each change.

The AI assistant provides:

* Context-aware AI chat with the AI model of your choice, whether from JetBrains, a third-party AI provider, or a local model.
* A choice of AI agents to work with, including Junie, Claude Code, OpenAI Codex, and any third-party agents that support the [Agent Client Protocol](#agent-client-protocol).
* AI-assisted code completion and next step suggestions.

Learn more about [AI assistant integration with JetBrains IDEs](https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html).

### Agent Client Protocol

The Agent Client Protocol (ACP) is an open protocol for connecting AI coding agents to IDEs and code editors.
Instead of requiring a separate integration for every agent and editor combination, ACP standardizes how agents and
clients communicate.

JetBrains IDEs support ACP, so you can use ACP-compatible agents from within the IDE.
This is useful when you want flexibility in choosing AI agents while continuing to work with
Kotlin-aware IDE features such as navigation, inspections, refactorings, and project analysis.
The registry provides access to multiple agents, including Claude Agent, Cursor, GitHub Copilot, OpenCode, and others.

See the full list of supported agents on the [ACP registry](https://agentclientprotocol.com/get-started/registry).

### MCP server

The [MCP server](https://plugins.jetbrains.com/plugin/26071-mcp-server) exposes IDE capabilities through the Model 
Context Protocol (MCP), allowing compatible AI agents to interact with your JetBrains IDE.

Without MCP, an external AI agent can usually access only your project files. Through MCP, the agent can also use
IDE capabilities such as project indexing, code navigation, refactoring, inspections, and build execution.
This gives external AI tools a better understanding of your Kotlin project.

If you prefer using an external AI agent such as Claude Code or Cursor, connect it to your JetBrains IDE through
the MCP server so it can use the IDE's Kotlin language intelligence while performing development tasks.

Learn more about [MCP server integration with JetBrains IDEs](https://www.jetbrains.com/help/idea/mcp-server.html).

## AI agents

### Junie

[Junie](https://www.jetbrains.com/junie/) is a JetBrains AI coding agent. It's deeply integrated into JetBrains IDEs and can use the running IDE engine.

Junie is designed for tasks that require more than a single code suggestion or chat response.
You can ask it to implement a feature, update code across multiple files, add tests, or perform maintenance work.
Junie can plan the work, explore the project, write code, run tests when needed, and present the result for review.

Because Junie works with IDE capabilities such as refactoring, debugging, and framework-aware navigation,
it can handle Kotlin projects with more context than tools that only read and write files.

Learn more about [Junie](https://junie.jetbrains.com/docs/get-started-with-junie.html).

### Third-party AI agents

Many third-party AI development tools support Kotlin. These tools may be available as IDE extensions,
standalone editors, command-line agents, or cloud-based development environments. For example:

* GitHub Copilot
* Google Gemini
* Claude Code
* OpenAI Codex
* and many more

Choose a third-party tool if it matches your preferred development environment or offers capabilities that fit your workflow.
Many of these tools support Kotlin code generation, explanations, test creation, and refactoring.

You can use third-party tools independently, or connect compatible agents to JetBrains IDEs through [ACP](#agent-client-protocol).

### Kotlin AI skills

Kotlin AI skills are reusable instructions that you provide to an AI agent.
They are not IDE features and are not agents themselves. Instead, they help an agent perform Kotlin development
tasks more consistently.

Use Kotlin AI skills when you want to guide an agent toward idiomatic Kotlin patterns,
Kotlin coding conventions, and project-specific expectations. Skills can support tasks such as writing Kotlin code,
explaining language features, generating documentation, creating tests, reviewing code, or applying migration guidance.

Kotlin AI skills can be used with different agents and workflows, including IDE-based agents,
command-line agents, and external AI tools that support reusable instructions.

Learn more about [](kotlin-ai-skills.md)

## Manage AI agents

### JetBrains Air

[JetBrains Air](https://air.dev/) is an agentic development environment for delegating coding tasks to multiple AI agents
and running them concurrently.

Use JetBrains Air when you want several agents to work on tasks at the same time while keeping each task isolated from
the main codebase. This is useful for experimentation, parallel implementation attempts, comparing agent output, or 
assigning different tasks to different agents.

Air provides a desktop experience for defining, planning, reviewing, and iterating on complex development tasks.
Agents can run locally or in isolated environments such as Docker containers and Git worktrees.
Depending on your setup, you can use a JetBrains AI subscription or your AI provider's API keys.

Learn more about [JetBrains Air](https://www.jetbrains.com/help/air/getting-started.html).

### JetBrains Central

[JetBrains Central](https://www.jetbrains.com/help/jetbrains-console/about-jetbrains-console.html) is an open platform for agent-driven software development across teams.
It connects tools, agents, and infrastructure so that automated work can be run, monitored, and managed in one place.

Use JetBrains Central when AI-assisted development needs to move beyond individual coding sessions.
For teams and organizations, the challenge is not only generating code, but also managing visibility, cost,
performance, results, and governance across many agent-driven tasks.

JetBrains Central helps organizations coordinate AI agents as part of software production rather than treating them
as isolated developer tools.

Learn more about [JetBrains Central](https://www.jetbrains.com/help/jetbrains-console/about-jetbrains-console.html).

### DPAI Arena

The [DPAI Arena](https://dpaia.dev/) is an open benchmarking platform for evaluating AI coding agents on real-world software engineering tasks.
It is designed to support multiple languages, frameworks, and development workflows.

Use the DPAI Arena when you need evidence about how AI coding agents perform on realistic development tasks.
Benchmark results can help teams compare tools, evaluate improvements, and make more informed
decisions about agent adoption.

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