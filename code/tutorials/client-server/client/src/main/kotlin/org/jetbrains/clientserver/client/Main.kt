package org.jetbrains.clientserver.client


native("jQuery")
val jq: dynamic = noImpl


fun main(args: Array<String>) {
    jq.get("http://localhost:8111/hello") { text ->
        val div = jq("#response")
        div.append(text)
    }
}