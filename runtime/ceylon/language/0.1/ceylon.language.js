(function(define) {
    define(function(require, exports, module) {

var _subm=require('./functions');
for (var $ in _subm) {
    exports[$]=_subm[$];
}
var _subm=require('./numbers');
for (var $ in _subm) {
    exports[$]=_subm[$];
}
var _subm=require('./strings');
for (var $ in _subm) {
    exports[$]=_subm[$];
}
var _subm=require('./types');
for (var $ in _subm) {
    exports[$]=_subm[$];
}

    });
}(typeof define==='function' && define.amd ? 
    define : function (factory) {
    if (typeof exports!=='undefined') {
        factory(require, exports, module);
    } else {
        throw "no module loader";
    }
}));
