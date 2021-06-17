document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.code-block[data-lang]').forEach(function (el) {
        hljs.highlightElement(el, { language: el.getAttribute('data-lang') });
    });
});
