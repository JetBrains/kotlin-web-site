define(['com/nav-tree'], function (NavTree) {

    return (function () {
        $(document).ready(function () {
            new NavTree(document.getElementById('reference-nav'));
        });
    });

});