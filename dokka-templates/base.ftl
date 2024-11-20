<#import "includes/page_metadata.ftl" as page_metadata>
<#import "includes/header.ftl" as header>
<#import "includes/footer.ftl" as footer>
<!DOCTYPE html>
<html lang="en-US" class="no-js">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8">
    <@page_metadata.display/>
    <@template_cmd name="pathToRoot"><script>var pathToRoot = "${pathToRoot}";</script></@template_cmd>
    <link rel="preload" href="${pathToRoot!""}navigation.html" as="document" type="text/html"/>
    <link rel="preload" href="/_assets/dokka-template.css?core-v1" as="style">
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
    <link rel="stylesheet" href="/_assets/dokka-template.css?core-v1">
    <@resources/>
</head>
<body class="${process.env.DOKKA_CUSTOM_BODY}">
<div class="root">
    {% ktl_component "header" searchAlgoliaIndexName="${process.env.ALGOLIA_INDEX_NAME}" %}
    <@header.display/>
    <div id="container" data-test="content">
        <div class="sidebar" id="leftColumn">
            <div class="sidebar--inner" id="sideMenu"></div>
        </div>
        <div id="main">
            <@content/>
            <#if "${process.env.DOKKA_FEEDBACK}" == "true">
            <div class="feedback-wrapper">
                <div class="feedback">
                    <div class="feedback__block" data-test="feedback-left"><p class="feedback__text">Thanks for your feedback!</p></div>
                    <div class="feedback__block feedback__block--active" data-test="feedback">
                        <div class="wt-row wt-row_size_xs wt-row_wide wt-row_wrap wt-row_justify_start">
                            <div class="wt-col-inline feedback__text">Was this page helpful?</div>
                            <div class="wt-col-inline">
                                <button data-test="feedback-yes" type="button" class="_main_joawza_17 _modeOutline_joawza_356 _sizeS_joawza_92 _alignIconLeft_joawza_77 feedback__button">Yes</button>
                                <button data-test="feedback-no" type="button" class="_main_joawza_17 _modeOutline_joawza_356 _sizeS_joawza_92 _alignIconLeft_joawza_77 feedback__button">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </#if>
            <@footer.display/>
        </div>
    </div>
</div>
<script defer src="/_assets/shared.js?core-v1" type="text/javascript"></script>
<script defer src="/_assets/dokka-template.js?core-v1" type="text/javascript"></script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5P98');</script>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5P98" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<#if "${process.env.DOKKA_FEEDBACK}" == "true">
<div class="feedback__popup-wrapper app-feedback-popup app-feedback-popup_close">
    <div class="feedback__popup feedback__popup--theme-light" data-test="feedback-popup">
        <form autocomplete="on">
            <div class="feedback__head feedback__head--theme-light" data-test="feedback-head">
                <legend class="feedback__legend">How can we improve?</legend>
                <div class="feedback__close-button">
                    <button data-test="feedback-close" aria-label="Close" title="Close" type="button" class="_main_joawza_17 _modeClear_joawza_434 _sizeS_joawza_92 _alignIconLeft_joawza_77 _withIcon_joawza_119 _withoutText_joawza_113">
                        <svg viewBox="0 0 24 24" class="wt-icon wt-icon_size_s _icon_joawza_525">
                            <path d="M19.707 5.707l-1.414-1.414L12 10.586 5.707 4.293 4.293 5.707 10.586 12l-6.293 6.293 1.414 1.414L12 13.414l6.293 6.293 1.414-1.414L13.414 12l6.293-6.293z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="feedback__field"><label class="_labelWrapper_hvg13z_44 _sizeM_hvg13z_98" data-test="textarea">
                <div class="_wrapper_hvg13z_48">
                    <textarea name="content" placeholder="Tell us what you think would make this page better" data-test-id="feedback-textarea" title="Content" class="_inner_hvg13z_61" aria-invalid="false" data-test="textarea__input" style="height: 112px !important;"></textarea>
                </div>
            </label></div>
            <div class="feedback__field"><div class="feedback__description feedback__description--theme-light">
                    Enter your name and email address if you would like to receive a&nbsp;follow-up message or&nbsp;<a class="link"
              data-test="feedback-support-link" href="https://kotl.in/issue"
              rel="noreferrer" target="_blank">contact our support</a>.</div></div>
            <div class="feedback__field">
                <div class="_container_1fowpgw_10 _container_1fowpgw_10 _classic_1fowpgw_44 _sizeM_1fowpgw_125 _enabled_1fowpgw_27" data-test="input"><label>
                    <div class="_wrapper_1fowpgw_14"><div class="_field_1fowpgw_161">
                        <input name="name" data-test="input__inner" autocomplete="name" title="Name" class="_inner_1fowpgw_171" type="text" placeholder="Name" aria-invalid="false" value=""></div>
                    </div>
                </label></div>
            </div>
            <div class="feedback__field">
                <div class="_container_1fowpgw_10 _container_1fowpgw_10 _classic_1fowpgw_44 _sizeM_1fowpgw_125 _enabled_1fowpgw_27" data-test="input"><label>
                    <div class="_wrapper_1fowpgw_14"><div class="_field_1fowpgw_161">
                        <input name="email" data-test-id="feedback-email" data-test="input__inner" title="Email address" class="_inner_1fowpgw_171" type="email" placeholder="Email address" aria-invalid="false" value="">
                    </div></div>
                </label></div>
            </div>
            <div class="feedback__field feedback__description feedback__description--theme-light" data-test="feedback-policy">
                By submitting this form, I agree that JetBrains s.r.o. ("JetBrains") may use my name, email address, phone number, and country of residence to provide support. I agree that JetBrains may process said data using <a href="https://www.jetbrains.com/legal/privacy/third-parties.html"
                   target="_blank">third-party services</a> for this purpose in accordance with the <a
                      href="https://www.jetbrains.com/company/privacy.html" target="_blank">JetBrains Privacy Policy</a>.
            </div>
            <div class="feedback__footer">
                <button data-test="feedback-send" title="Send feedback" name="send" type="submit" disabled="disabled" class="_main_joawza_17 _modeClassic_joawza_135 _sizeM_joawza_99 _alignIconLeft_joawza_77 _disabled_joawza_61 button_disabled">Send feedback</button>
            </div>
        </form>
    </div>
</div>
</#if>
</body>
</html>