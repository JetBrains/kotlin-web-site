$(document).ready(() => {
  function tabCaptionForSelectedLanguage(string) {
    if (string.toLowerCase() === "macos") return "macOS";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function switchSampleLanguage(containerClass, selectorClass, dataField, localStoreKey, languageId) {
    function processSampleEl(sampleEl, prefLangId) {
      const expectLang = (prefLangId || 'ann').toLowerCase();
      const elementLang = (sampleEl.getAttribute(dataField) || 'NAN').toLowerCase();
      if (expectLang !== elementLang) {
        sampleEl.classList.add("hide");
      } else {
        sampleEl.classList.remove("hide");
      }
    }

    var multiLanguageSampleElements = [].slice.call(document.querySelectorAll("." + containerClass));

    // Array of Arrays, each top-level array representing a single collection of samples
    var multiLanguageSets = [];
    for (var i = 0; i < multiLanguageSampleElements.length; i++) {
      var currentCollection = [multiLanguageSampleElements[i]];
      var currentSampleElement = multiLanguageSampleElements[i];
      processSampleEl(currentSampleElement, languageId);
      while (currentSampleElement.nextElementSibling != null && currentSampleElement.nextElementSibling.classList.contains(containerClass)) {
        currentCollection.push(currentSampleElement.nextElementSibling);
        currentSampleElement = currentSampleElement.nextElementSibling;
        processSampleEl(currentSampleElement, languageId);
        i++;
      }

      multiLanguageSets.push(currentCollection);
    }

    multiLanguageSets.forEach(function (sampleCollection) {
      // Create selector element if not existing
      if (sampleCollection.length > 1 &&
        (sampleCollection[0].previousElementSibling == null ||
          !sampleCollection[0].previousElementSibling.classList.contains(selectorClass))
      ) {
        const languageSelectorFragment = document.createDocumentFragment();
        const multiLanguageSelectorElement = document.createElement("div");
        multiLanguageSelectorElement.classList.add(selectorClass);
        languageSelectorFragment.appendChild(multiLanguageSelectorElement);

        sampleCollection.forEach(function (sampleEl) {
          const optionEl = document.createElement("code");
          const sampleLanguage = sampleEl.getAttribute(dataField);
          optionEl.setAttribute(dataField, sampleLanguage);
          optionEl.setAttribute("role", "button");

          optionEl.classList.add("language-option");

          optionEl.innerText = tabCaptionForSelectedLanguage(sampleLanguage);

          optionEl.addEventListener("click", function updatePreferredLanguage(evt) {
            const preferredLanguageId = optionEl.getAttribute(dataField);
            window.localStorage.setItem(localStoreKey, preferredLanguageId);

            // Record how far down the page the clicked element is before switching all samples
            const beforeOffset = evt.target.offsetTop;

            switchSampleLanguage(containerClass, selectorClass, dataField, localStoreKey, preferredLanguageId);

            // Scroll the window to account for content height differences between different sample languages
            window.scrollBy(0, evt.target.offsetTop - beforeOffset);
          });
          multiLanguageSelectorElement.appendChild(optionEl);
        });
        sampleCollection[0].parentNode.insertBefore(languageSelectorFragment, sampleCollection[0]);
      }
    });

    [].slice.call(document.querySelectorAll("." + selectorClass + " .language-option")).forEach(function (optionEl) {
      if (optionEl.getAttribute(dataField) === languageId) {
        optionEl.classList.add("selected");
      } else {
        optionEl.classList.remove("selected");
      }
    });
  }

  // Ensure preferred DSL is valid, defaulting to Groovy DSL
  const gradleDslKey = "preferred-gradle-dsl";
  const osKey = "preferred-os";

  function initPreferredBuildScriptLanguage() {
    let lang = window.localStorage.getItem(gradleDslKey) || 'nan';
    if (["groovy", "kotlin"].indexOf(lang) === -1) {
      lang = "kotlin";
      window.localStorage.setItem(gradleDslKey, lang);
    }
    return lang;
  }

  function initPreferredOSLanguage() {
    let osName = window.localStorage.getItem(osKey) || 'nan';
    if (["windows", "linux", "macOS"].indexOf(osName) === -1) {
      osName = "macOS";
      const appVersion = (navigator || {}).appVersion || '';
      if (appVersion.indexOf("Win") !== -1) osName = "windows";
      if (appVersion.indexOf("Mac") !== -1) osName = "macOS";
      if (appVersion.indexOf("X11") !== -1) osName = "linux";
      if (appVersion.indexOf("Linux") !== -1) osName = "linux";
      window.localStorage.setItem(osKey, osName);
    }
    return osName;
  }

  switchSampleLanguage("multi-language-sample", "multi-language-selector", "data-lang", gradleDslKey, initPreferredBuildScriptLanguage());
  switchSampleLanguage("multi-os-sample", "multi-os-selector", "data-os", osKey, initPreferredOSLanguage());
});
