<#import "includes/page_metadata.ftl" as page_metadata>
<#import "includes/header.ftl" as header>
<#import "includes/footer.ftl" as footer>
<!DOCTYPE html>
<html class="no-js">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8">
    <@page_metadata.display/>
    <@template_cmd name="pathToRoot"><script>var pathToRoot = "${pathToRoot}";</script></@template_cmd>
    <script>document.documentElement.classList.replace("no-js","js");</script>
    <#-- This script doesn't need to be there but it is nice to have
    since app in dark mode doesn't 'blink' (class is added before it is rendered) -->
    <script>const storage = localStorage.getItem("dokka-dark-mode")
      if (storage == null) {
        const osDarkSchemePreferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        if (osDarkSchemePreferred === true) {
          document.getElementsByTagName("html")[0].classList.add("theme-dark")
        }
      } else {
        const savedDarkMode = JSON.parse(storage)
        if(savedDarkMode === true) {
          document.getElementsByTagName("html")[0].classList.add("theme-dark")
        }
      }
    </script>
    <#-- Resources (scripts, stylesheets) are handled by Dokka.
    Use customStyleSheets and customAssets to change them. -->
    <@resources/>
    <@template_cmd name="pathToRoot">
    <link rel="stylesheet" href="/_assets/dokka-template.css">
    </@template_cmd>
</head>
<body>
<div class="root">
    {% ktl_component "header" %}
    <@header.display/>
    <div id="container" data-test="content">
        <div class="sidebar" id="leftColumn">
            <div class="sidebar--inner" id="sideMenu"></div>
        </div>
        <div id="main">
            <@content/>
            <@footer.display/>
        </div>
    </div>
</div>
<@template_cmd name="pathToRoot">
<script defer src="/_assets/shared.js" type="text/javascript"></script>
<script defer src="/_assets/dokka-template.js" type="text/javascript"></script>
</@template_cmd>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5P98');</script>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5P98" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
</body>
</html>