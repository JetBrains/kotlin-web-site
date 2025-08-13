package common.extensions

import jetbrains.buildServer.configs.kotlin.DslContext

fun isProjectPlayground(): Boolean = DslContext.projectId.value.contains("Kotlin_KotlinSites_Playground")
