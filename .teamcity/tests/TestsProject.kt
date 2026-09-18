package tests

import jetbrains.buildServer.configs.kotlin.Project


object TestsProject : Project({
  name = "Site Tests"

  buildType(tests.buildTypes.E2ETests)
  buildType(tests.buildTypes.E2EProductionTest)
})

