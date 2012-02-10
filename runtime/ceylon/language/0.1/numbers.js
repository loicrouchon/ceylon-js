(function(define) {
    define(function(require, exports, module) {

var clang = require('./types');

var $Integer = clang.Integer.$$;
$Integer.prototype.getString = function() { return clang.String(this.value.toString()) }
$Integer.prototype.plus = function(other) { return clang.Integer(this.value+other.value) }
$Integer.prototype.minus = function(other) { return clang.Integer(this.value-other.value) }
$Integer.prototype.times = function(other) { return clang.Integer(this.value*other.value) }
$Integer.prototype.divided = function(other) {
    var exact = this.value/other.value;
    return clang.Integer((exact<0) ? Math.ceil(exact) : Math.floor(exact));
}
$Integer.prototype.remainder = function(other) { return clang.Integer(this.value%other.value) }
$Integer.prototype.power = function(other) {
    var exact = Math.pow(this.value, other.value);
    return clang.Integer((exact<0) ? Math.ceil(exact) : Math.floor(exact));
}
$Integer.prototype.getNegativeValue = function() { return clang.Integer(-this.value) }
$Integer.prototype.getPositiveValue = function() { return this }
$Integer.prototype.equals = function(other) { return clang.Boolean(other && other.value===this.value) }
$Integer.prototype.compare = function(other) {
    return this.value===other.value ? clang.getEqual()
                                    : (this.value<other.value ? clang.getSmaller():clang.getLarger());
}
$Integer.prototype.getFloat = function() { return clang.Float(this.value) }
$Integer.prototype.getInteger = function() { return this }
$Integer.prototype.getCharacter = function() { return clang.Character(this.value); }
$Integer.prototype.getSuccessor = function() { return clang.Integer(this.value+1) }
$Integer.prototype.getPredecessor = function() { return clang.Integer(this.value-1) }
$Integer.prototype.getUnit = function() { return clang.Boolean(this.value === 1) }
$Integer.prototype.getZero = function() { return clang.Boolean(this.value === 0) }
$Integer.prototype.getFractionalPart = function() { return clang.Integer(0); }
$Integer.prototype.getWholePart = function() { return this; }
$Integer.prototype.getSign = function() { return this.value > 0 ? clang.Integer(1) : this.value < 0 ? clang.Integer(-1) : clang.Integer(0); }
$Integer.prototype.getHash = function() { return this; }

var $Float = clang.Float.$$;
$Float.prototype.getString = function() { return clang.String(this.value.toString()) }
$Float.prototype.plus = function(other) { return clang.Float(this.value+other.value) }
$Float.prototype.minus = function(other) { return clang.Float(this.value-other.value) }
$Float.prototype.times = function(other) { return clang.Float(this.value*other.value) }
$Float.prototype.divided = function(other) { return clang.Float(this.value/other.value) }
$Float.prototype.power = function(other) { return clang.Float(Math.pow(this.value, other.value)) }
$Float.prototype.getNegativeValue = function() { return clang.Float(-this.value) }
$Float.prototype.getPositiveValue = function() { return this }
$Float.prototype.equals = function(other) { return clang.Boolean(other && other.value===this.value) }
$Float.prototype.compare = function(other) {
    if (other === null || other === undefined) { return clang.getLarger(); }
    return this.value===other.value ? clang.getEqual()
                                    : (this.value<other.value ? clang.getSmaller():clang.getLarger());
}
$Float.prototype.getFloat = function() { return this }
$Float.prototype.getInteger = function() { return clang.Integer(parseInt(this.value.toFixed())); }
$Float.prototype.getWholePart = function() {
    var _p = this.value.toPrecision();
    var dot = _p.indexOf('.');
    return dot >= 0 ? clang.Float(parseFloat(_p.slice(0, dot))) : this;
}
$Float.prototype.getFractionalPart = function() {
    var _p = this.value.toPrecision();
    var dot = _p.indexOf('.');
    return dot >= 0 ? clang.Float(parseFloat(_p.slice(dot))) : clang.Float(0.0);
}
$Float.prototype.getSign = function() { return this.value > 0 ? clang.Integer(1) : this.value < 0 ? clang.Integer(-1) : clang.Integer(0); }
$Float.prototype.getHash = function() { return clang.String(this.value.toPrecision()).getHash(); }
$Float.prototype.getUndefined = function() { return isNaN(this.value) ? clang.getTrue() : clang.getFalse(); }
$Float.prototype.getFinite = function() { return this.value!==Infinity && this.value!==-Infinity && !isNaN(this.value) ? clang.getTrue() : clang.getFalse(); }
$Float.prototype.getInfinite = function() { return this.value===Infinity || this.value===-Infinity ? clang.getTrue() : clang.getFalse(); }

function $parseInteger(s) { return clang.Integer(parseInt(s.value)); }
function $parseFloat(s) { return clang.Float(parseFloat(s.value)); }
exports.parseInteger=$parseInteger;
exports.parseFloat=$parseFloat;

function getInfinity() { return clang.Float(Infinity); }
exports.getInfinity=getInfinity;

    });
}(typeof define==='function' && define.amd ? 
    define : function (factory) {
    if (typeof exports!=='undefined') {
        factory(require, exports, module);
    } else {
        throw "no module loader";
    }
}));
