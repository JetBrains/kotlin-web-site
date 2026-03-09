package landings.builds

import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.remoteParameters.hashiCorpVaultParameter

/**
 * Configures AWS deployment parameters for landing page deployments.
 * Sets up Vault integration for secure credential management.
 */
fun BuildType.configureAwsDeploymentParams() {
  params {
    param("teamcity.vault.set.env", "true")
    param("env.AWS_DEFAULT_REGION", "eu-west-1")
    param("env.AWS_ACCESS_KEY_ID", "%KOTLIN_AWS_ACCESS_KEY_ID%")
    param("env.AWS_SECRET_ACCESS_KEY", "%KOTLIN_AWS_SECRET_ACCESS_KEY%")
    param("env.AWS_SESSION_TOKEN", "%KOTLIN_AWS_SESSION_TOKEN%")
    hashiCorpVaultParameter {
      name = "KOTLIN_AWS_ACCESS_KEY_ID"
      display = ParameterDisplay.HIDDEN
      query = "aws-main/sts/kotlin-teamcity-deployer!/access_key"
      vaultId = "kotlin"
    }
    hashiCorpVaultParameter {
      name = "KOTLIN_AWS_SECRET_ACCESS_KEY"
      display = ParameterDisplay.HIDDEN
      query = "aws-main/sts/kotlin-teamcity-deployer!/secret_key"
      vaultId = "kotlin"
    }
    hashiCorpVaultParameter {
      name = "KOTLIN_AWS_SESSION_TOKEN"
      display = ParameterDisplay.HIDDEN
      query = "aws-main/sts/kotlin-teamcity-deployer!/security_token"
      vaultId = "kotlin"
    }
  }
}
