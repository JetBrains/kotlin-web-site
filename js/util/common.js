define({
    isArray: function(variable) {
        return variable instanceof Array;
    },

    isObject: function(variable) {
        return variable instanceof Object;
    },

    isDate: function(variable) {
        return variable instanceof Date;
    }
});