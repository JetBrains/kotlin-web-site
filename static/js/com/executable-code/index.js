const ExecutableFragment = require('./executable-fragment');
const $ = require('jquery');

module.exports = function (element) {
  const code = $(element).find('code')[0].textContent;
  const executableFragmentContainer = document.createElement('div');
  element.parentNode.replaceChild(executableFragmentContainer, element);

  var view = ExecutableFragment.render(executableFragmentContainer);
  view.update({
    'code': code
  });
};