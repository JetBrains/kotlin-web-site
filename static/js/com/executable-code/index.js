const ExecutableFragment = require('./executable-fragment');
const WebDemoApi = require('./webdemo-api');
const $ = require('jquery');

module.exports = function (element) {
  const code = $(element).find('code')[0].textContent;
  const executableFragmentContainer = document.createElement('div');
  element.parentNode.replaceChild(executableFragmentContainer, element);

  const view = ExecutableFragment.render(executableFragmentContainer);
  WebDemoApi.getCompilerVersion().then(function (compilerVersion) {
    view.update({
      code: code,
      compilerVersion: compilerVersion
    });
  });
};