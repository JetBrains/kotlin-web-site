package builds.kotlinlang.buidTypes

import jetbrains.buildServer.configs.kotlin.BuildType

object PageViews : BuildType({
    name = "Fetch Page Views"
    description = "Build data files with page views statistics for kotlin websites"
})
