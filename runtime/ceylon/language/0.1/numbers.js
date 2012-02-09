(function(define) {
    define(function(require, exports, module) {

var clang = require('ceylon/language/0.1/ceylon.language');

function Number(wat) {
    return wat;
}
clang.initType(Number, 'ceylon.language.Number', clang.Equality);
exports.Number=Number;
function Numeric(wat) {
    return wat;
}
clang.initType(Numeric, 'ceylon.language.Numeric', Number, clang.Comparable, clang.Summable, clang.Invertable);
exports.Numeric=Numeric;
function Ordinal(wat) {
    return wat;
}
clang.initType(Ordinal, 'ceylon.language.Ordinal', clang.Equality);
exports.Ordinal=Ordinal;
function Integral(wat) {
    return wat;
}
clang.initType(Integral, 'ceylon.language.Integral', Numeric, Ordinal);
exports.Integral=Integral;

function Integer(value) {
    var that = new Integer.$$;
    that.value = value;
    return that;
}
clang.initType(Integer, 'ceylon.language.Integer', clang.Object, clang.Castable, Integral, Numeric);
clang.inheritProto(Integer, clang.Object, '$Object$');
exports.Integer=Integer;
var $Integer = Integer.$$;
$Integer.prototype.getString = function() { return clang.String(this.value.toString()) }
$Integer.prototype.plus = function(other) { return Integer(this.value+other.value) }
$Integer.prototype.minus = function(other) { return Integer(this.value-other.value) }
$Integer.prototype.times = function(other) { return Integer(this.value*other.value) }
$Integer.prototype.divided = function(other) {
    var exact = this.value/other.value;
    return Integer((exact<0) ? Math.ceil(exact) : Math.floor(exact));
}
$Integer.prototype.remainder = function(other) { return Integer(this.value%other.value) }
$Integer.prototype.power = function(other) {
    var exact = Math.pow(this.value, other.value);
    return Integer((exact<0) ? Math.ceil(exact) : Math.floor(exact));
}
$Integer.prototype.getNegativeValue = function() { return Integer(-this.value) }
$Integer.prototype.getPositiveValue = function() { return this }
$Integer.prototype.equals = function(other) { return clang.Boolean(other && other.value===this.value) }
$Integer.prototype.compare = function(other) {
    return this.value===other.value ? clang.getEqual()
                                    : (this.value<other.value ? clang.getSmaller():clang.getLarger());
}
$Integer.prototype.getFloat = function() { return Float(this.value) }
$Integer.prototype.getInteger = function() { return this }
$Integer.prototype.getCharacter = function() { return clang.Character(this.value); }
$Integer.prototype.getSuccessor = function() { return Integer(this.value+1) }
$Integer.prototype.getPredecessor = function() { return Integer(this.value-1) }
$Integer.prototype.getUnit = function() { return clang.Boolean(this.value === 1) }
$Integer.prototype.getZero = function() { return clang.Boolean(this.value === 0) }
$Integer.prototype.getFractionalPart = function() { return Integer(0); }
$Integer.prototype.getWholePart = function() { return this; }
$Integer.prototype.getSign = function() { return this.value > 0 ? Integer(1) : this.value < 0 ? Integer(-1) : Integer(0); }
$Integer.prototype.getHash = function() { return this; }

function Float(value) {
    var that = new Float.$$;
    that.value = value;
    return that;
}
clang.initType(Float, 'ceylon.language.Float', clang.Object, clang.Castable, Numeric);
clang.inheritProto(Float, clang.Object, '$Object$');
exports.Float=Float;
var $Float = Float.$$;
$Float.prototype.getString = function() { return clang.String(this.value.toString()) }
$Float.prototype.plus = function(other) { return Float(this.value+other.value) }
$Float.prototype.minus = function(other) { return Float(this.value-other.value) }
$Float.prototype.times = function(other) { return Float(this.value*other.value) }
$Float.prototype.divided = function(other) { return Float(this.value/other.value) }
$Float.prototype.power = function(other) { return Float(Math.pow(this.value, other.value)) }
$Float.prototype.getNegativeValue = function() { return Float(-this.value) }
$Float.prototype.getPositiveValue = function() { return this }
$Float.prototype.equals = function(other) { return clang.Boolean(other && other.value===this.value) }
$Float.prototype.compare = function(other) {
    if (other === null || other === undefined) { return clang.getLarger(); }
    return this.value===other.value ? clang.getEqual()
                                    : (this.value<other.value ? clang.getSmaller():clang.getLarger());
}
$Float.prototype.getFloat = function() { return this }
$Float.prototype.getInteger = function() { return Integer(parseInt(this.value.toFixed())); }
$Float.prototype.getWholePart = function() {
    var _p = this.value.toPrecision();
    var dot = _p.indexOf('.');
    return dot >= 0 ? Float(parseFloat(_p.slice(0, dot))) : this;
}
$Float.prototype.getFractionalPart = function() {
    var _p = this.value.toPrecision();
    var dot = _p.indexOf('.');
    return dot >= 0 ? Float(parseFloat(_p.slice(dot))) : Float(0.0);
}
$Float.prototype.getSign = function() { return this.value > 0 ? Integer(1) : this.value < 0 ? Integer(-1) : Integer(0); }
$Float.prototype.getHash = function() { return clang.String(this.value.toPrecision()).getHash(); }
$Float.prototype.getUndefined = function() { return isNaN(this.value) ? clang.getTrue() : clang.getFalse(); }
$Float.prototype.getFinite = function() { return this.value!==Infinity && this.value!==-Infinity && !isNaN(this.value) ? clang.getTrue() : clang.getFalse(); }
$Float.prototype.getInfinite = function() { return this.value===Infinity || this.value===-Infinity ? clang.getTrue() : clang.getFalse(); }

    });
}(typeof define==='function' && define.amd ? 
    define : function (factory) {
    if (typeof exports!=='undefined') {
        factory(require, exports, module);
    } else {
        throw "no module loader";
    }
}));
