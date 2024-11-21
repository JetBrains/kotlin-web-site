<#macro display>
    <#assign title = pageName + " | " + ${process.env.DOKKA_SITENAME}>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="icon" type="image/svg" sizes="16x16" href="https://kotlinlang.org/assets/images/favicon.svg?v2">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="https://kotlinlang.org/assets/images/favicon.ico?v2">
    <link rel="icon" type="image/png" sizes="96x96" href="https://kotlinlang.org/assets/images/apple-touch-icon.png?v2">
    <link rel="icon" type="image/png" sizes="300x300"
          href="https://kotlinlang.org/assets/images/apple-touch-icon-72x72.png?v2">
    <link rel="icon" type="image/png" sizes="500x500"
          href="https://kotlinlang.org/assets/images/apple-touch-icon-114x114.png?v2">
    <meta name="image" content="https://kotlinlang.org/assets/images/open-graph/general.png">
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <!-- <meta property="og:description" content=""> -->
    <meta property="og:image" content="https://kotlinlang.org/assets/images/open-graph/general.png">
    <meta property="og:site_name" content="${process.env.DOKKA_SITENAME}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">
    <!-- <meta property="og:url" content="{}"> -->
    <!-- End Open Graph -->
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@kotlin">
    <meta name="twitter:title" content="${title}">
<#--    <meta name="twitter:description" content="">-->
    <meta name="twitter:creator" content="@kotlin">
    <meta name="twitter:image:src" content="https://kotlinlang.org/assets/images/open-graph/general.png">
    <!-- End Twitter Card -->
</#macro>
