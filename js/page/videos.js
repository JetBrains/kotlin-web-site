define(['com/nav-tree'], function(NavTree) {

    return function(data) {
        new NavTree(data.elem, {data: data.videos});
    };

});