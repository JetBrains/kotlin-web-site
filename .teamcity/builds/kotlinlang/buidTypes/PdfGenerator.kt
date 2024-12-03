package builds.kotlinlang.buidTypes

import builds.SCRIPT_PATH
import builds.kotlinlang.templates.DockerImageBuilder
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object PdfGenerator : BuildType({
  name = "PDF Generator"
  description = "Build PDF reference https://kotlinlang.org/docs/"

  templates(DockerImageBuilder)

  artifactRules = """
      dist/docs/pdf.html
      pdf/kotlin-docs.pdf
  """.trimIndent()

  requirements {
    doesNotContain("docker.server.osType", "windows")
  }

  steps {
    script {
      id = "script-dist-pdf-html"
      name = "Generate pdf.html"
        //language=bash
        scriptContent = """
        #!/bin/sh
        set -e
        npm install
        npm run generate-pdf
      """.trimIndent()
      dockerImage = "node:22-alpine"
      workingDir = SCRIPT_PATH
    }
    script {
      name = "Generate PDF"
      //language=sh
      scriptContent = """
        # install legacy wkhtmltopdf deps
        apt update
        apt install -y xfonts-75dpi xfonts-100dpi libjpeg62-turbo xfonts-base
        wget https://deb.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb
        wget https://deb.debian.org/debian/pool/main/o/openssl/libssl-dev_1.1.1w-0+deb11u1_amd64.deb
        wget https://deb.debian.org/debian/pool/main/o/openssl/openssl_1.1.1w-0+deb11u1_amd64.deb
        dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb libssl-dev_1.1.1w-0+deb11u1_amd64.deb openssl_1.1.1w-0+deb11u1_amd64.deb
        ln -s /usr/lib/x86_64-linux-gnu/libjpeg.so.62 /usr/lib/x86_64-linux-gnu/libjpeg.so.8
        # refresh wkhtmltopdf 
        wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb
        dpkg -i wkhtmltox_0.12.6-1.buster_amd64.deb
        
        ## refresh packages
        pip install -r requirements.txt
        python kotlin-website.py reference-pdf
      """.trimIndent()
      dockerImage = "python:3.9"
    }
  }

  dependencies {
    dependency(BuildReferenceDocs) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }
      artifacts {
        artifactRules = "+:docs.zip!** => dist/docs/"
      }
    }
  }
})
