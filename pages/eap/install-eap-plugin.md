---
layout: default
title: Install the EAP Plugin for IntelliJ IDEA or Android Studio
main_nav_id: install-eap-plugin
---

# Install the Kotlin EAP Plugin for IntelliJ IDEA or Android Studio

You can follow these instructions to install [the preview version of the Kotlin Plugin for IntelliJ IDEA or Android Studio](index.html#build-details).


1. Select **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates**. 
<img class="img-responsive" src="{{ url_for('asset', path='images/eap/idea-kotlin-plugin-updates.png' )}}" alt="Select Kotlin Plugin Updates" width="600" />

2. In the **Update channel** list, select the **Early Access Preview *X*** channel, where *X* is the latest version of Kotlin.
<img class="img-responsive" src="{{ url_for('asset', path='images/eap/idea-kotlin-update-channel.png' )}}" alt="Select the EAP update channel" width="500"/>

3. Click **Check again**.<br>
The latest EAP build version appears.
<img class="img-responsive" src="{{ url_for('asset', path='images/eap/idea-latest-kotlin-eap.png' )}}" alt="Install the EAP build" width="500px" />

4. Click **Install**. 

If you want to work on existing projects that were created before installing the EAP version, you need to [configure your build for EAP](configure-build-for-eap.html). 
