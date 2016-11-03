const ExecutableFragment = require('./executable-fragment');

module.exports = function (element) {
  const code = element.childNodes[0].textContent;
  const executableFragmentContainer = document.createElement('div');
  element.parentNode.replaceChild(executableFragmentContainer, element);

  var view = ExecutableFragment.render(executableFragmentContainer);
  view.update({
    'code': code
  });
};