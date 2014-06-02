define(['com/nav-tree-new'], function(NavTree) {

    return function(data) {
        new NavTree(data.elem, data.categories);
    };

});