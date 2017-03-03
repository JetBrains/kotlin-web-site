const ExecutableFragment = require('./executable-fragment');
const WebDemoApi = require('./webdemo-api');
const $ = require('jquery');

module.exports = function (nodesOrSelector) {
  WebDemoApi.getCompilerConfigs().then(compilerConfigs => {
    $(nodesOrSelector).each((ind, element) => {
      const code = $(element).find('code')[0].textContent;
      const executableFragmentContainer = document.createElement('div');
      element.parentNode.replaceChild(executableFragmentContainer, element);
      const minCompilerVersion = element.getAttribute("data-min-compiler-version");

      const view = ExecutableFragment.render(executableFragmentContainer);
      let latestStableVersion;
      compilerConfigs.forEach(compilerConfig => {
        if (compilerConfig.latestStable) {
          latestStableVersion = compilerConfig.version
        }
      });

      let compilerVersion;
      if (minCompilerVersion) {
        compilerVersion = minCompilerVersion > latestStableVersion ?
          compilerConfigs[compilerConfigs.length - 1].version :
          latestStableVersion
      } else {
        compilerVersion = latestStableVersion
      }

      view.update({
        code: code,
        compilerVersion: compilerVersion
      });
    });
  });
};