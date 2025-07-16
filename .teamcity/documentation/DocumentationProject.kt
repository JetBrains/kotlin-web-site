package documentation

import documentation.builds.KotlinMultiplatform
import documentation.builds.KotlinWithCoroutines
import documentation.vcsRoots.KotlinMultiplatformVCS
import jetbrains.buildServer.configs.kotlin.Project

object DocumentationProject: Project({
    name = "Documentation"
    description = "Build kotlin documentation"

    buildTypesOrder = arrayListOf(
        KotlinWithCoroutines,
        KotlinMultiplatform,
    )

    buildTypesOrder.forEach {
        buildType(it)
    }

    vcsRoot(KotlinMultiplatformVCS)
})
