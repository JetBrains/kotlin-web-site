$(document).ready(() => {
  function capitalizeFirstLetter(string) {
    if (string === "macOS") return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function switchSampleLanguage(containerClass, selectorClass, dataField, localStoreKey, languageId) {
    function processSampleEl(sampleEl, prefLangId) {
      const expectLang = (prefLangId || 'ann').toLowerCase();
      const elementLang = (sampleEl.getAttribute(dataField) || 'NAN').toLowerCase();
      ///we may mix linux and macOS in the name, both should work
      if (!expectLang.includes(elementLang) && !elementLang.includes(expectLang)) {
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

          optionEl.innerText = capitalizeFirstLetter(sampleLanguage);

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

  var GRADLE_DSLs = ["groovy", "kotlin"];
  // Ensure preferred DSL is valid, defaulting to Groovy DSL
  const gradleDslKey = "preferred-gradle-dsl";
  const osKey = "preferred-os";

  function initPreferredBuildScriptLanguage() {
    let lang = window.localStorage.getItem(gradleDslKey);
    if (GRADLE_DSLs.indexOf(lang) === -1) {
      window.localStorage.setItem(gradleDslKey, "groovy");
      lang = "groovy";
    }
    return lang;
  }

  switchSampleLanguage("multi-language-sample", "multi-language-selector", "data-lang", gradleDslKey, initPreferredBuildScriptLanguage());
  switchSampleLanguage("multi-os-sample", "multi-os-selector", "data-os", osKey, window.localStorage.getItem(osKey) || 'macOS');
});
