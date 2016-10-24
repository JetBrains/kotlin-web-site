define(['com/nav-tree'], function (NavTree) {

    $(':header').each(function (ind, element) {
        var id = element.getAttribute("id");
        var tagName = element.tagName.toLowerCase();
        if( id == null) return;
        if(!(tagName == "h1" || tagName == "h2" || tagName == "h3")) return;
        var referenceElement = document.createElement("a");
        referenceElement.className = "anchor";
        referenceElement.href = "#" + id;
        element.appendChild(referenceElement)
    });

    return (function () {
        $(document).ready(function () {
            new NavTree(document.getElementById('tutorials-nav'));
        });
    })();

});