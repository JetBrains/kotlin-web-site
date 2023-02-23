package builds.kotlinlang.buidTypes

import builds.kotlinlang.templates.DockerImageBuilder
import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script


object PdfGenerator : BuildType({
  name = "PDF Generator"
  description = "Build PDF reference https://kotlinlang.org/docs/"

  templates(DockerImageBuilder)

  artifactRules = "pdf/kotlin-docs.pdf => kotlin-docs.pdf"

  steps {
    script {
      scriptContent = """
        #!/bin/bash
        
        mv ./dist/docs/pdfSourceKR.html ./dist/docs/pdf.html
        
        ## refresh packages
        pip install -r requirements.txt
        
        python kotlin-website.py reference-pdf
      """.trimIndent()
      dockerImage = "%dep.Kotlin_KotlinSites_Builds_KotlinlangOrg_BuildPythonContainer.kotlin-website-image%"
    }
  }

  dependencies {
    dependency(AbsoluteId("Documentation_TransitioningProducts_KotlinReferenceWithCoroutines")) {
      snapshot {
      }

      artifacts {
        cleanDestination = true
        artifactRules = """
          webHelpImages.zip!** => dist/docs/images
          pdfSourceKR.html => dist/docs/
        """.trimIndent()
      }
    }
  }
})
