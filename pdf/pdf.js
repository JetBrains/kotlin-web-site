document.addEventListener("DOMContentLoaded", function () {
    const list = document.querySelectorAll('.code-block[data-lang]');

    // IMPORTANT: It's important to use *var* and *for* (not forEach) in wkhtmltopdf 0.12.6.
    for (var i = 0; i < list.length; i++) {
        const node = list[i];
        const lang = node.getAttribute('data-lang');

        if (lang && Prism && Prism.languages[lang]) {
            const code = node.innerText;
            node.innerHTML = Prism.highlight(code, Prism.languages[lang], lang);
        }
    }
});
