package documentation

import documentation.builds.KotlinMultiplatform
import documentation.builds.KotlinWithCoroutines
import documentation.vcsRoots.*
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
    vcsRoot(KotlinReferenceRoot)
    vcsRoot(KotlinxCoroutinesRoot)
    vcsRoot(KotlinxLincheckRoot)
    vcsRoot(DokkaRoot)
    vcsRoot(APIGuidelinesRoot)
})
