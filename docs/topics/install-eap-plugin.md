[//]: # (title: Install the EAP Plugin for IntelliJ IDEA or Android Studio)

<microformat>
    <p>Latest Kotlin EAP release: <strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">Explore Kotlin EAP release details</a></p>
</microformat>

You can follow these instructions to install [the preview version of the Kotlin Plugin for IntelliJ IDEA or Android Studio](eap.md#build-details).

1. Select **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates**. 
    
   ![Select Kotlin Plugin Updates](idea-kotlin-plugin-updates.png)
   {width="600"}
    
2. In the **Update channel** list, select the **Early Access Preview *X*** channel, where *X* is the latest version of Kotlin.
    
    ![Select the EAP update channel](idea-kotlin-update-channel.png)
    {width="500"}

3. Click **Check again**. The latest EAP build version appears.
    ![Install the EAP build](idea-latest-kotlin-eap.png)
    {width="500"}

4. Click **Install**. 

If you want to work on existing projects that were created before installing the EAP version, you need to [configure your build for EAP](configure-build-for-eap.md). 

## If you run into any problems

* Report an issue to [our issue tracker, YouTrack](https://kotl.in/issue).
* Find help in the _#eap_ channel on [Slack](https://kotlinlang.slack.com/) ([get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).
* Roll back to the latest stable version by selecting the **Stable** update channel in 
  **Tools | Kotlin | Configure Kotlin Plugin Updates**, and clicking **Install** to install the latest version. 
