define(['com/nav-tree', 'com/nav-tree-new'], function (NavTree, NavTree2) {

    return (function (data) {
        $(document).ready(function () {

            new NavTree2(document.getElementById('reference-nav'), data);

            return;
            new NavTree(document.getElementById('reference-nav'));
        });
    });

});