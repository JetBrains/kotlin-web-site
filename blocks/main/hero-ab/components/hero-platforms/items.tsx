import React, { ReactNode } from 'react';

import MultiplatformIcon from '@/blocks/main/hero-ab/images/icons/multiplatform.svg';
import BackendIcon from '@/blocks/main/hero-ab/images/icons/backend.svg';
import AndroidIcon from '@/blocks/main/hero-ab/images/icons/android.svg';
import AIIcon from '@/blocks/main/hero-ab/images/icons/ai.svg';

interface FeatureItem {
    id: string;
    icon: ImgSrc;
    title: string;
    description: ReactNode;
    linkUrl: string;
}

interface FeatureSlideItem extends FeatureItem {
    codeSample: string;
}

const kmpCodeSample = `
expect fun platform(): String

@Composable
fun App() {
    var greeting by remember { mutableStateOf("") }
    MaterialTheme {
        Button(onClick = { greeting = "Hello from \${platform()}!" }) {
            Text(if (greeting.isEmpty()) "Click me!" else greeting)
        }
    }
}`;
const backendCodeSample = `fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
            get("/json") {
                call.respond(mapOf("message" to "Hello"))
            }
        }
    }.start(wait = true)
}`;

const androidCodeSample = `@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}

@Composable
fun App() {
    Column {
        Greeting("Android")
        Greeting("Compose")
    }
}`;

const aiCodeSample = `fun main() {
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
}`;

export const heroPlatformItems: FeatureSlideItem[] = [
    {
        id: 'multiplatform',
        icon: MultiplatformIcon,
        title: 'Multiplatform',
        description: 'Go cross‑platform without compromising performance, UX, or code quality.',
        codeSample: kmpCodeSample,
        linkUrl: '/multiplatform/'
    },
    {
        id: 'backend',
        icon: BackendIcon,
        title: 'Backend',
        description: 'Build fast applications with Spring or Ktor. Kotlin\'s expressiveness makes backend code a pleasure to write and maintain.',
        codeSample: backendCodeSample,
        linkUrl: '/server-side/'
    },
    {
        id: 'android',
        icon: AndroidIcon,
        title: 'Android',
        description: 'Write less boilerplate, ship more features with the official language of Android development since 2019.',
        codeSample: androidCodeSample,
        linkUrl: '/docs/android-overview.html'
    },
    {
        id: 'ai',
        icon: AIIcon,
        title: 'AI',
        description: 'Leverage AI models tailored for Kotlin, backed by JetBrains\' open data, benchmarks, and tooling built into your workflow.',
        codeSample: aiCodeSample,
        linkUrl: '/docs/kotlin-ai-apps-development-overview.html'
    }
];
