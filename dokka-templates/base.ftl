<#import "includes/page_metadata.ftl" as page_metadata>
<#import "includes/header.ftl" as header>
<#import "includes/footer.ftl" as footer>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8">
    <@page_metadata.display/>
    <@template_cmd name="pathToRoot">
        <script>var pathToRoot = "${pathToRoot}";</script>
    </@template_cmd>
    <#-- This script doesn't need to be there but it is nice to have
    since app in dark mode doesn't 'blink' (class is added before it is rendered) -->
    <script>const storage = localStorage.getItem("dokka-dark-mode")
      const savedDarkMode = storage ? JSON.parse(storage) : false
      if(savedDarkMode === true){
        document.getElementsByTagName("html")[0].classList.add("theme-dark")
      }</script>
    <#-- Resources (scripts, stylesheets) are handled by Dokka.
    Use customStyleSheets and customAssets to change them. -->
    <@resources/>

    <link rel="stylesheet" href="/_assets/dokka-template.css">

    <script>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-5P98');
    </script>
</head>
<body>
<@header.display/>
<div id="container" data-test="content">
    <div id="leftColumn">
        <div id="sideMenu"></div>
    </div>
    <div id="ktl-main">
        <div id="main">
            <@content/>
        </div>
        <@footer.display/>
    </div>
</div>
<script defer src="/_assets/shared.js" type="text/javascript"></script>
<script defer src="/_assets/dokka-template.js" type="text/javascript"></script>

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5P98" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

</body>
</html>