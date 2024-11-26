[//]: # (title: Install the EAP Plugin for IntelliJ IDEA or Android Studio)

<tldr>
    <p>No preview versions are currently available</p>
    <!-- <p>Latest Kotlin EAP release: <strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">Explore Kotlin EAP release details</a></p> -->
</tldr>

> Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin doesn't need to be
> configured separately. All you need to do is [change the Kotlin version](configure-build-for-eap.md) in your build scripts.
> 
{style="note"}

You can follow these instructions to install the preview version of the Kotlin Plugin for IntelliJ IDEA or Android Studio.

1. Select **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates**. 
    
   ![Select Kotlin Plugin Updates](idea-kotlin-plugin-updates.png)
   {width="600"}
    
2. In the **Update channel** list, select the **Early Access Preview** channel.
    
    ![Select the EAP update channel](idea-kotlin-update-channel.png)
    {width="500"}

3. Click **Check again**. The latest EAP build version appears.

    ![Install the EAP build](idea-latest-kotlin-eap.png)
    {width="500"}
   
   > If the Kotlin EAP plugin can't find the latest EAP build, check that you are using the latest version of [IntelliJ IDEA](https://www.jetbrains.com/help/idea/update.html) or [Android Studio](https://developer.android.com/studio/intro/update).
   >
   {style="note"}

4. Click **Install**. 

If you want to work on existing projects that were created before installing the EAP version, you need to [configure your build for EAP](configure-build-for-eap.md). 

## If you run into any problems

* Report an issue to [our issue tracker, YouTrack](https://kotl.in/issue).
* Find help in the [#eap channel in Kotlin Slack](https://app.slack.com/client/T09229ZC6/C0KLZSCHF) ([get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).
* Roll back to the latest stable version: in **Tools | Kotlin | Configure Kotlin Plugin Updates**, select the **Stable**
  update channel and click **Install**.