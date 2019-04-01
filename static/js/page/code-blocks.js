import $ from 'jquery';

// Ensure preferred DSL is valid, defaulting to Groovy DSL
const gradleKey = "preferred-gradle-dsl";
const osKey = "preferred-os";

const loadInitialState = () => {
  function initPreferredBuildScriptLanguage() {
    let lang = window.localStorage.getItem(gradleKey) || 'nan';
    if (["groovy", "kotlin"].indexOf(lang) === -1) {
      lang = "kotlin";
    }
    return lang;
  }

  function initPreferredOSLanguage() {
    let osName = window.localStorage.getItem(osKey) || 'nan';
    if (["windows", "linux", "macos"].indexOf(osName) === -1) {
      osName = "macos";
      const appVersion = (navigator || {}).appVersion || '';
      if (appVersion.indexOf("Win") !== -1) osName = "windows";
      if (appVersion.indexOf("Mac") !== -1) osName = "macos";
      if (appVersion.indexOf("X11") !== -1) osName = "linux";
      if (appVersion.indexOf("Linux") !== -1) osName = "linux";
    }
    return osName;
  }

  return {
    gradleValue: initPreferredBuildScriptLanguage(),
    osValue: initPreferredOSLanguage()
  };
};

const saveState = ({osValue = '', gradleValue = ''} = {}) => {
  if (osValue !== '') window.localStorage.setItem(osKey, osValue);
  if (gradleValue !== '') window.localStorage.setItem(gradleKey, gradleValue);
  return loadInitialState();
};

$(document).ready(() => {
  const multiLanguageSampleClass = 'multi-language-sample';
  const dataSelectedGroupId = 'data-selector-group';

  // select code sections and group neighbours to same groups
  const selectorGroups = {};
  [].slice.call(document.querySelectorAll("." + multiLanguageSampleClass)).forEach((divElement, index) => {
    const prevSibling = divElement.previousElementSibling;
    let groupId;

    if (prevSibling !== null && prevSibling.classList.contains(multiLanguageSampleClass)) {
       groupId = prevSibling.getAttribute(dataSelectedGroupId);
    } else {
       groupId = "group-" + index;
    }

    divElement.setAttribute(dataSelectedGroupId, groupId);

    const groupMembers  = (selectorGroups[groupId] || {snippets: [], gradleOptions: [], osOptions: [], gradleTabs : [], osTabs: []} );
    selectorGroups[groupId] = groupMembers;

    const osValue = (divElement.getAttribute("data-os") || '').toLowerCase();
    const gradleValue = (divElement.getAttribute("data-lang") || '').toLowerCase();

    if (osValue !== '' && groupMembers.osOptions.indexOf(osValue) === -1) {
      groupMembers.osOptions.push(osValue)
    }

    if (gradleValue !== '' && groupMembers.gradleOptions.indexOf(gradleValue) === -1) {
      groupMembers.gradleOptions.push(gradleValue)
    }

    const updateSelected = state => {
      const selectedOs = osValue === '' || osValue === state.osValue;
      const selectedGradle = gradleValue === '' || gradleValue === state.gradleValue;

      if (selectedOs && selectedGradle) {
        divElement.classList.remove("hide")
      } else {
        divElement.classList.add("hide")
      }
    };

    groupMembers.snippets.push({
      updateSelected,
      code: divElement
    });
  });

  const updateState = (newStatePatch) => {
    //update local storage
    const state = saveState(newStatePatch);

    for (const groupKey in selectorGroups) {
      if (!selectorGroups.hasOwnProperty(groupKey)) continue;

      const group = selectorGroups[groupKey];

      group.snippets.forEach(snippet => {
        snippet.updateSelected(state);
      });

      group.gradleTabs.forEach(tab => {
        tab.updateSelected(state);
      });

      group.osTabs.forEach(tab => {
        tab.updateSelected(state);
      })
    }
  };

  //generate tabs section
  for (const groupKey in selectorGroups) {
    if (!selectorGroups.hasOwnProperty(groupKey)) continue;
    const group = selectorGroups[groupKey];
    const firstCodeBlockNode = group.snippets[0].code;
    const languageSelectorFragment = document.createDocumentFragment();
    const multiLanguageSelectorElement = document.createElement("div");
    multiLanguageSelectorElement.classList.add("multi-language-selector");
    languageSelectorFragment.appendChild(multiLanguageSelectorElement);

    group.gradleOptions.forEach(opt => {
      const optionEl = document.createElement("code");
      optionEl.setAttribute("data-lang", opt);
      optionEl.setAttribute("role", "button");

      optionEl.classList.add("language-option");
      optionEl.innerText = opt;

      group.gradleTabs.push({
        updateSelected: state => {
          if (state.gradleValue === opt) {
            optionEl.classList.add("selected");
          } else {
            optionEl.classList.remove("selected");
          }
        }
      });

      optionEl.addEventListener("click", () => {
        updateState({gradleValue: opt})
      });

      multiLanguageSelectorElement.appendChild(optionEl);
    });

    group.osOptions.forEach(opt => {
      const optionEl = document.createElement("code");
      optionEl.setAttribute("data-os", opt);
      optionEl.setAttribute("role", "button");

      optionEl.classList.add("os-option");
      optionEl.innerText = " ";

      group.osTabs.push({
        updateSelected: state => {
          if (state.osValue === opt) {
            optionEl.classList.add("selected");
          } else {
            optionEl.classList.remove("selected");
          }
        }
      });

      optionEl.addEventListener("click", () => {
        updateState({osValue: opt})
      });

      multiLanguageSelectorElement.appendChild(optionEl);
    });

    const clearDiv = document.createElement("div");
    clearDiv.setAttribute("clear", "both");
    languageSelectorFragment.appendChild(clearDiv);

    firstCodeBlockNode.parentNode.insertBefore(languageSelectorFragment, firstCodeBlockNode);
  }

  updateState()
});


