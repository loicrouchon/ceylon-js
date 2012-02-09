(function(define) {
    define(function(require, exports, module) {

//the Ceylon language module
function print(line) { console.log(line.getString().value) }
exports.print=print;

function initType(type, typeName) {
    var cons = function() {}
    type.$$ = cons;
    cons.T$name = typeName;
    cons.T$all = {}
    cons.T$all[typeName] = type;
    for (var i=2; i<arguments.length; ++i) {
        var superTypes = arguments[i].$$.T$all;
        for ($ in superTypes) {cons.T$all[$] = superTypes[$]}
    }
}
function inheritProto(type, superType, suffix) {
    var proto = type.$$.prototype;
    var superProto = superType.$$.prototype;
    for(var $ in superProto){
        var $m = superProto[$];
        proto[$] = $m;
        if(suffix!==undefined && $.charAt($.length-1)!=='$') {proto[$+suffix] = $m}
    }
}
exports.initType=initType;
exports.inheritProto=inheritProto;

// TODO: Equality will probably be removed
function Equality(wat) {
    return wat;
}
initType(Equality, 'ceylon.language.Equality');
exports.Equality=Equality;

function Void(wat) {
    return wat;
}
initType(Void, 'ceylon.language.Void');
function Object$(wat) {
    return wat;
}
initType(Object$, 'ceylon.language.Object', Void);
exports.Object=Object$;
var $Object = Object$.$$;
$Object.prototype.getString=function() { exports.String(Object.prototype.toString.apply(this)) };
$Object.prototype.toString=function() { return this.getString().value };
$Object.prototype.equals = function(other) { return Boolean$(this===other) } //TODO: is this correct?
function IdentifiableObject(obj) {
    return obj;
}
initType(IdentifiableObject, 'ceylon.language.IdentifiableObject', Object$, Equality);
inheritProto(IdentifiableObject, Object$, '$Object$');
exports.IdentifiableObject=IdentifiableObject;

//INTERFACES
function Cloneable(wat) {
    return wat;
}
initType(Cloneable, 'ceylon.language.Cloneable');
exports.Cloneable=Cloneable;
function Callable(wat) {
    return wat;
}
initType(Castable, 'ceylon.language.Callable');
exports.Callable=Callable;
function Castable(wat) {
    return wat;
}
initType(Castable, 'ceylon.language.Castable');
exports.Castable=Castable;
function Closeable(wat) {
    return wat;
}
initType(Closeable, 'ceylon.language.Closeable');
exports.Closeable=Closeable;
function Comparable(wat) {
    return wat;
}
initType(Comparable, 'ceylon.language.Comparable', Equality);
exports.Comparable=Comparable;
function Container(wat) {
    return wat;
}
initType(Container, 'ceylon.language.Container');
exports.Container=Container;
function Correspondence(wat) {
    return wat;
}
initType(Correspondence, 'ceylon.language.Correspondence');
exports.Correspondence=Correspondence;
function Sized(wat) {
    return wat;
}
initType(Sized, 'ceylon.language.Sized', Container);
exports.Sized=Sized;
function Iterable(wat) {
    return wat;
}
initType(Iterable, 'ceylon.language.Iterable', Container);
exports.Iterable=Iterable;
function Category(wat) {
    return wat;
}
initType(Category, 'ceylon.language.Category');
exports.Category=Category;
function Iterator(wat) {
    return wat;
}
initType(Iterator, 'ceylon.language.Iterator');
exports.Iterator=Iterator;
function Collection(wat) {
    return wat;
}
initType(Collection, 'ceylon.language.Collection', Iterable, Sized, Category, Equality, Cloneable);
exports.Collection=Collection;
function FixedSized(wat) {
    return wat;
}
initType(FixedSized, 'ceylon.language.FixedSized', Collection);
exports.FixedSized=FixedSized;
function Some(wat) {
    return wat;
}
initType(Some, 'ceylon.language.Some', FixedSized);
exports.Some=Some;
function Summable(wat) {
    return wat;
}
initType(Summable, 'ceylon.language.Summable');
exports.Summable=Summable;
function Number(wat) {
    return wat;
}
initType(Number, 'ceylon.language.Number', Equality);
exports.Number=Number;
function Invertable(wat) {
    return wat;
}
initType(Invertable, 'ceylon.language.Invertable');
exports.Invertable=Invertable;
function Numeric(wat) {
    return wat;
}
initType(Numeric, 'ceylon.language.Numeric', Number, Comparable, Summable, Invertable);
exports.Numeric=Numeric;
function Ordinal(wat) {
    return wat;
}
initType(Ordinal, 'ceylon.language.Ordinal', Equality);
exports.Ordinal=Ordinal;
function Integral(wat) {
    return wat;
}
initType(Integral, 'ceylon.language.Integral', Numeric, Ordinal);
exports.Integral=Integral;
function Ranged(wat) {
    return wat;
}
initType(Ranged, 'ceylon.language.Ranged');
exports.Ranged=Ranged;
function List(wat) {
    return wat;
}
initType(List, 'ceylon.language.List', Collection, Correspondence, Ranged, Cloneable);
exports.List=List;
function Map(wat) {
    return wat;
}
initType(Map, 'ceylon.language.Map', Collection, Correspondence, Cloneable);
exports.Map=Map;
function None(wat) {
    return wat;
}
initType(None, 'ceylon.language.None', FixedSized);
exports.None=None;
function Set(wat) {
    return wat;
}
initType(Set, 'ceylon.language.Set', Collection, Cloneable);
exports.Set=Set;

//Interface methods
var $FixedSized = FixedSized.$$;
$FixedSized.prototype.getFirst = function() {
    var e = this.getIterator().next();
    return e === $finished ? null : e;
}

var $None = None.$$;
$None.prototype.getFirst = function() { return null; }
$None.prototype.getIterator = function() { return emptyIterator; }
$None.prototype.getSize = function() { return Integer(0); }
$None.prototype.getEmpty = function() { return $true; }

var $Some = Some.$$;
$Some.prototype.getFirst = function() {
    var e = this.getIterator().next();
    if (e === $finished) throw Exception();
    return e;
}
$Some.prototype.getEmpty = function() { return $false; }

function Exception(description, cause, wat) {
    if (wat===undefined) {wat=new $Exception}
    wat.description = description;
    wat.cause = cause;
    return wat;
}
initType(Exception, 'ceylon.language.Exception', IdentifiableObject);
inheritProto(Exception, IdentifiableObject, '$IdentifiableObject$');
exports.Exception=Exception;
var $Exception = Exception.$$;
$Exception.prototype.getCause = function() {return this.cause}
$Exception.prototype.getMessage = function() {
    return this.description!==null ? this.description
           : (this.cause!==null ? this.cause.getMessage() : exports.String("", 0));
}
$Exception.prototype.getString = function() {
    return exports.String('Exception "' + this.getMessage().value + '"');
}

function Integer(value) {
    var that = new Integer.$$;
    that.value = value;
    return that;
}
initType(Integer, 'ceylon.language.Integer', Object$, Castable, Integral, Numeric);
inheritProto(Integer, Object$, '$Object$');
exports.Integer=Integer;
var $Integer = Integer.$$;
$Integer.prototype.getString = function() { return exports.String(this.value.toString()) }
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
$Integer.prototype.equals = function(other) { return Boolean$(other && other.value===this.value) }
$Integer.prototype.compare = function(other) {
    return this.value===other.value ? equal
                                    : (this.value<other.value ? smaller:larger);
}
$Integer.prototype.getFloat = function() { return Float(this.value) }
$Integer.prototype.getInteger = function() { return this }
$Integer.prototype.getCharacter = function() { return exports.Character(this.value); }
$Integer.prototype.getSuccessor = function() { return Integer(this.value+1) }
$Integer.prototype.getPredecessor = function() { return Integer(this.value-1) }
$Integer.prototype.getUnit = function() { return Boolean$(this.value === 1) }
$Integer.prototype.getZero = function() { return Boolean$(this.value === 0) }
$Integer.prototype.getFractionalPart = function() { return Integer(0); }
$Integer.prototype.getWholePart = function() { return this; }
$Integer.prototype.getSign = function() { return this.value > 0 ? Integer(1) : this.value < 0 ? Integer(-1) : Integer(0); }
$Integer.prototype.getHash = function() { return this; }

function $parseInteger(s) { return Integer(parseInt(s.value)); }
function $parseFloat(s) { return Float(parseFloat(s.value)); }
exports.parseInteger=$parseInteger;
exports.parseFloat=$parseFloat;

function Float(value) {
    var that = new Float.$$;
    that.value = value;
    return that;
}
initType(Float, 'ceylon.language.Float', Object$, Castable, Numeric);
inheritProto(Float, Object$, '$Object$');
exports.Float=Float;
var $Float = Float.$$;
$Float.prototype.getString = function() { return exports.String(this.value.toString()) }
$Float.prototype.plus = function(other) { return Float(this.value+other.value) }
$Float.prototype.minus = function(other) { return Float(this.value-other.value) }
$Float.prototype.times = function(other) { return Float(this.value*other.value) }
$Float.prototype.divided = function(other) { return Float(this.value/other.value) }
$Float.prototype.power = function(other) { return Float(Math.pow(this.value, other.value)) }
$Float.prototype.getNegativeValue = function() { return Float(-this.value) }
$Float.prototype.getPositiveValue = function() { return this }
$Float.prototype.equals = function(other) { return Boolean$(other && other.value===this.value) }
$Float.prototype.compare = function(other) {
    if (other === null || other === undefined) { return larger; }
    return this.value===other.value ? equal
                                    : (this.value<other.value ? smaller:larger);
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
$Float.prototype.getHash = function() { return exports.String(this.value.toPrecision()).getHash(); }
$Float.prototype.getUndefined = function() { return isNaN(this.value) ? $true : $false; }
$Float.prototype.getFinite = function() { return this.value!==Infinity && this.value!==-Infinity && !isNaN(this.value) ? $true : $false; }
$Float.prototype.getInfinite = function() { return this.value===Infinity || this.value===-Infinity ? $true : $false; }

function getInfinity() { return Float(Infinity); }
//function getNegativeInfinity() { return Float(-Infinity); }
exports.getInfinity=getInfinity;

var _subm=require('ceylon/language/0.1/strings');
for (var $ in _subm) {
    exports[$]=_subm[$];
}

function StringBuilder() {
    var that = new StringBuilder.$$;
    that.value = "";
    return that;
}
initType(StringBuilder, 'ceylon.language.StringBuilder', IdentifiableObject);
inheritProto(StringBuilder, IdentifiableObject, '$IdentifiableObject$');
exports.StringBuilder=StringBuilder;
var $StringBuilder = StringBuilder.$$;
$StringBuilder.prototype.getString = function() { return exports.String(this.value); }
$StringBuilder.prototype.append = function(s) {
    this.value = this.value + s.value;
}
$StringBuilder.prototype.appendAll = function(strings) {
    if (strings === null || strings === undefined) { return this; }
    for (var i = 0; i < strings.value.length; i++) {
        var _s = strings.value[i];
        this.value += _s?_s.value:"null";
    }
    return this; //strictly speaking, this method should return void, but then string interpolation would be a big mess
}
$StringBuilder.prototype.appendCharacter = function(c) {
    this.append(c.getString());
}
$StringBuilder.prototype.appendNewline = function() { this.value = this.value + "\n"; }
$StringBuilder.prototype.appendSpace = function() { this.value = this.value + " "; }

function getNull() { return null }
exports.getNull=getNull;
function Boolean$(value) {
    return value ? $true : $false;
}
initType(Boolean$, 'ceylon.language.Boolean', IdentifiableObject);
inheritProto(Boolean$, IdentifiableObject, '$IdentifiableObject$');
exports.Boolean=Boolean$;
var $true = new Boolean$.$$;
$true.string = exports.String("true");
$true.getString = function() {return this.string}
function getTrue() { return $true; }
var $false = new Boolean$.$$;
$false.string = exports.String("false");
$false.getString = function() {return this.string}
function getFalse() { return $false; }
exports.getTrue=getTrue;
exports.getFalse=getFalse;

function Finished() {}
initType(Finished, 'ceylon.language.Finished', IdentifiableObject);
inheritProto(Finished, IdentifiableObject, '$IdentifiableObject$');
var $finished = new Finished.$$;
$finished.string = exports.String("exhausted");
$finished.getString = function() {return this.string}
function getExhausted() { return $finished; }
exports.getExhausted=getExhausted;

function Comparison(name) {
    var that = new Comparison.$$;
    that.name = exports.String(name);
    return that;
}
initType(Comparison, 'ceylon.language.Comparison', IdentifiableObject);
inheritProto(Comparison, IdentifiableObject, '$IdentifiableObject$');
exports.Comparison=Comparison;
var $Comparison = Comparison.$$;
$Comparison.prototype.getString = function() { return this.name }

var larger = Comparison("larger");
function getLarger() { return larger }
var smaller = Comparison("smaller");
function getSmaller() { return smaller }
var equal = Comparison("equal");
function getEqual() { return equal }
function largest(x, y) { return x.compare(y) === larger ? x : y }
function smallest(x, y) { return x.compare(y) === smaller ? x : y }
exports.getLarger=getLarger;
exports.getSmaller=getSmaller;
exports.getEqual=getEqual;
exports.largest=largest;
exports.smallest=smallest;

function Sequence($$sequence) {
    return $$sequence;
}
initType(Sequence, 'ceylon.language.Sequence', List, Some, Cloneable, Ranged);
exports.Sequence=Sequence;
var $Sequence = Sequence.$$;
$Sequence.prototype.getEmpty = function() { return $false }
$Sequence.prototype.getSize = function() { return Integer(this.getLastIndex()+1) }
$Sequence.prototype.defines = function(index) { return Boolean$(index.value<=this.getLastIndex().value) }

function Empty() {
    var that = new Empty.$$;
    that.value = [];
    return that;
}
initType(Empty, 'ceylon.language.Empty', List, None, Ranged, Cloneable);
var $Empty = Empty.$$;
$Empty.prototype.getEmpty = function() { return $true; }
$Empty.prototype.defines = function(x) { return $false; }
$Empty.prototype.getKeys = function() { return IntCategory(this); }
$Empty.prototype.definesEvery = function(x) { return $false; }
$Empty.prototype.definesAny = function(x) { return $false; }
$Empty.prototype.items = function(x) { return this; }
$Empty.prototype.getSize = function() { return Integer(0); }
$Empty.prototype.item = function(x) { return null; }
$Empty.prototype.getFirst = function() { return null; }
$Empty.prototype.segment = function(a,b) { return this; }
$Empty.prototype.span = function(a,b) { return this; }
$Empty.prototype.getIterator = function() { return emptyIterator; }
$Empty.prototype.getString = function() { return exports.String("{}"); }
$Empty.prototype.contains = function(x) { return $false; }
$Empty.prototype.getLastIndex = function() { return null; }
$Empty.prototype.getClone = function() { return this; }
$Empty.prototype.count = function(x) { return Integer(0); }

$empty = Empty();
exports.empty=$empty;

function EmptyIterator() {
    var that = new EmptyIterator.$$;
    return that;
}
initType(EmptyIterator, 'ceylon.language.EmptyIterator', IdentifiableObject, Iterator);
inheritProto(EmptyIterator, IdentifiableObject, '$IdentifiableObject$');
var $EmptyIterator = EmptyIterator.$$;
$EmptyIterator.prototype.next = function() { return $finished; }
emptyIterator=EmptyIterator();
exports.emptyIterator=emptyIterator;

var _subm=require('ceylon/language/0.1/functions');
for (var $ in _subm) {
    exports[$]=_subm[$];
}

function ArraySequence(value) {
    var that = new ArraySequence.$$;
    that.value = value;
    return that;
}
initType(ArraySequence, 'ceylon.language.ArraySequence', IdentifiableObject, Sequence);
inheritProto(ArraySequence, IdentifiableObject, '$IdentifiableObject$');
inheritProto(ArraySequence, Sequence, '$Sequence$');
exports.ArraySequence=ArraySequence;
var $ArraySequence = ArraySequence.$$;
$ArraySequence.prototype.getString = function() {
	if (this.value.length === 0) {
		return exports.String("{}");
	}
    var desc = "{ ";
    var first = true;
    for (var i = 0; i < this.value.length; i++) {
        if (first) {
            first = false;
		} else {
            desc += ", ";
        }
        var item = this.value[i];
        desc += exports.exists(item) === $true ? item.getString().value : "null";
    }
    return exports.String(desc +" }");
}
$ArraySequence.prototype.item = function(index) {
    var result = this.value[index.value];
    return result!==undefined ? result:null;
}
$ArraySequence.prototype.getSize = function() { return Integer(this.value.length) }
$ArraySequence.prototype.getEmpty = function() { return this.value.length > 0 ? getFalse() : getTrue(); }
$ArraySequence.prototype.getLastIndex = function() { return this.getSize().getPredecessor(); }
$ArraySequence.prototype.getFirst = function() { return this.item(Integer(0)); }
$ArraySequence.prototype.getLast = function() { return this.item(this.getLastIndex()); }
$ArraySequence.prototype.defines = function(idx) { return Boolean$(idx.compare(this.getSize()) === smaller); }
$ArraySequence.prototype.segment = function(from, len) {
    var seq = [];
    if (len.compare(Integer(0)) === larger) {
        var stop = from.plus(len).value;
        for (var i=from.value; i < stop; i++) {
            var x = this.item(Integer(i));
            if (x !== getNull()) { seq.push(x); }
        }
    }
    return ArraySequence(seq);
}
$ArraySequence.prototype.span = function(from, to) {
    var fromIndex = largest(Integer(0),from).value;
    var toIndex = to === getNull() || to === undefined ? this.getLastIndex().value : smallest(to, this.getLastIndex()).value;
    var seq = [];
    if (fromIndex === toIndex) {
        return Singleton(this.item(from));
    } else if (toIndex > fromIndex) {
        for (var i = fromIndex; i <= toIndex && this.defines(Integer(i)) === $true; i++) {
            seq.push(this.item(Integer(i)));
        }
    } else {
        //Negative span, reverse seq returned
        for (var i = fromIndex; i >= toIndex && this.defines(Integer(i)) === $true; i--) {
            seq.push(this.item(Integer(i)));
        }
    }
    return ArraySequence(seq);
}
$ArraySequence.prototype.getRest = function() { return ArraySequence(this.value.slice(1)); }
$ArraySequence.prototype.items = function(keys) {
    var seq = [];
    for (var i = 0; i < keys.getSize().value; i++) {
        var key = keys.item(Integer(i));
        if (this.defines(key)) {
            seq.push(this.item(key));
        }
    }
    return ArraySequence(seq);
}
$ArraySequence.prototype.definesEvery = function(keys) {
    for (var i = 0; i < keys.getSize().value; i++) {
        if (this.defines(keys.item(Integer(i))) === getFalse()) {
            return getFalse();
        }
    }
    return getTrue();
}
$ArraySequence.prototype.definesAny = function(keys) {
    for (var i = 0; i < keys.getSize().value; i++) {
        if (this.defines(keys.item(Integer(i))) === getTrue()) {
            return getTrue();
        }
    }
    return getFalse();
}
$ArraySequence.prototype.equals = function(other) {
    if (other && other.getSize().equals(this.getSize()) === getTrue()) {
        for (var i = 0; i < this.getSize().value; i++) {
            var mine = this.item(Integer(i));
            var theirs = other.item(Integer(i));
            if (((mine === null) && theirs) || !(mine && mine.equals(theirs) === getTrue())) {
                return getFalse();
            }
        }
        return getTrue();
    }
    return getFalse();
}
$ArraySequence.prototype.getIterator = function() { return ArrayIterator(this.value); }
$ArraySequence.prototype.getKeys = function() { return IntCategory(this); }

function IntCategory(seq) {
    var that = new IntCategory.$$;
    that.seq = seq;
    return that;
}
initType(IntCategory, 'ceylon.language.IntCategory', IdentifiableObject, Category);
inheritProto(IntCategory, IdentifiableObject, '$IdentifiableObject$');
var $IntCategory = IntCategory.$$;
$IntCategory.prototype.contains = function(k) {
    return this.seq.defines(k);
}
$IntCategory.prototype.containsEvery = function(keys) {
    var all = true;
    for (var i = 0; i < this.seq.value.length; i++) {
        all = all && this.seq.defines(keys.item(Integer(i))).value;
    }
    return Boolean$(all);
}
$IntCategory.prototype.containsAny = function(keys) {
    for (var i = 0; i < this.seq.value.length; i++) {
        if (this.seq.defines(keys.item(Integer(i))) == $true) {
            return $true;
        }
    }
    return $false;
}

function ArrayIterator(arr) {
    var that = new ArrayIterator.$$;
    that.array = arr;
    that.current = arr && arr.length ? arr[0] : $finished;
    that.idx = 0;
    return that;
}
initType(ArrayIterator, 'ceylon.language.ArrayIterator', IdentifiableObject, Iterator);
inheritProto(ArrayIterator, IdentifiableObject, '$IdentifiableObject$');
var $ArrayIterator = ArrayIterator.$$;
$ArrayIterator.prototype.next = function() {
    if (this.current === $finished) {
        return $finished;
    }
    this.current = this.idx < this.array.length ? this.array[this.idx] : $finished;
    this.idx++;
    return this.current;
}

function SequenceBuilder() {
    var that = new SequenceBuilder.$$;
    that.seq = [];
    return that;
}
initType(SequenceBuilder, 'ceylon.language.SequenceBuilder', IdentifiableObject, Sized);
inheritProto(SequenceBuilder, IdentifiableObject, '$IdentifiableObject$');
exports.SequenceBuilder=SequenceBuilder;
var $SequenceBuilder = SequenceBuilder.$$;
$SequenceBuilder.prototype.getSequence = function() { return ArraySequence(this.seq); }
$SequenceBuilder.prototype.append = function(e) { this.seq.push(e); }
$SequenceBuilder.prototype.appendAll = function(arr) {
	if (arr && arr.value && arr.value.length) {
        for (var i = 0; i < arr.value.length; i++) {
            this.seq.push(arr.value[i]);
        }
    }
}
$SequenceBuilder.prototype.getSize = function() { return Integer(this.seq.length); }
$SequenceBuilder.prototype.getEmpty = function() { return Boolean$(this.seq.length === 0); }

function SequenceAppender(other) {
	var that = new SequenceAppender.$$;
	that.seq = [];
	that.appendAll(other);
	return that;
}
initType(SequenceAppender, 'ceylon.language.SequenceAppender', SequenceBuilder);
inheritProto(SequenceAppender, SequenceBuilder, '$SequenceBuilder$');
exports.SequenceAppender=SequenceAppender;

function Range(first, last) {
    var that = new Range.$$;
    that.first = first;
    that.last = last;
    var index = 0;
    var x = first;
    var dec = first.compare(last) === larger;
    while (x.equals(last) === getFalse()) { //some replicated code because we don't yet have the functions here
        index++;
        x = dec ? x.getPredecessor() : x.getSuccessor();
    }
    that.size = Integer(index+1);
    return that;
}
initType(Range, 'ceylon.language.Range', Object$, Sequence, Category, Equality);
inheritProto(Range, Object$, '$Object$');
inheritProto(Range, Sequence, '$Sequence$');
exports.Range=Range;
var $Range = Range.$$;
$Range.prototype.getFirst = function() { return this.first; }
$Range.prototype.getLast = function() { return this.last; }
$Range.prototype.getEmpty = function() { return getFalse(); }
$Range.prototype.getDecreasing = function() {
    return Boolean$(this.first.compare(this.last) === larger);
}
$Range.prototype.next = function(x) {
    return this.getDecreasing() === getTrue() ? x.getPredecessor() : x.getSuccessor();
}
$Range.prototype.getSize = function() { return this.size; }
$Range.prototype.getLastIndex = function() { return Integer(this.size-1); }
$Range.prototype.item = function(index) {
    var idx = 0;
    var x = this.first;
    while (idx < index.value) {
        if (x.equals(this.last) === getTrue()) { return getNull(); }
        else {
            idx++;
            x = this.next(x);
        }
    }
    return x;
}
$Range.prototype.includes = function(x) {
    var compf = x.compare(this.first);
    var compl = x.compare(this.last);
    var rval = this.getDecreasing() === getTrue() ? ((compf === equal || compf === smaller) && (compl === equal || compl === larger)) : ((compf === equal || compf === larger) && (compl === equal || compl === smaller));
    return Boolean$(rval);
}
$Range.prototype.contains = function(x) {
    if (typeof x.compare==='function' || (x.prototype && typeof x.prototype.compare==='function')) {
        return this.includes(x);
    }
    return $false;
}
$Range.prototype.getRest = function() {
    var n = this.next(this.first);
    return (n.equals(this.last) === getTrue()) ? ArraySequence([]) : Range(n, this.last);
}
$Range.prototype.by = function(step) {
    if (step.compare(Integer(0)) !== larger) {
        //throw
    }
    if (this.first.equals(this.last) === getTrue() || step.equals(Integer(1)) === getTrue()) {
        return this;
    }
    var seq = [];
    var x = this.first;
    while (this.includes(x) === getTrue()) {
        seq.push(x);
        for (var i = 0; i < step.value; i++) { x = this.next(x); }
    }
    return ArraySequence(seq);
}
$Range.prototype.segment = function(from, len) {
    //only positive length for now
    if (len.compare(Integer(0)) !== larger) return $empty;
    if (this.defines(from) === $false) return $empty;
    var x = this.first;
    for (var i=0; i < from.value; i++) { x = this.next(x); }
    var y = x;
    for (var i=1; i < len.value; i++) { y = this.next(y); }
    if (this.includes(y) === getFalse()) { y = this.last; }
    return Range(x, y);
}
$Range.prototype.span = function(from, to) {
    from = largest(Integer(0),from);
    if (to === getNull() || to === undefined) {
        to = this.getLastIndex();
    }
    if (this.defines(from) === $false) {
        //If it's an inverse range, adjust the "from" (upper bound)
        if (from.compare(to) === larger && this.defines(to) === $true) {
            //Decrease the upper bound
            while (!this.defines(from)) {
                from = from.getPredecessor();
            }
        } else {
            return $empty;
        }
    } else while (this.defines(to) === $false) {
        //decrease the upper bound
        to = to.getPredecessor();
    }
    return Range(this.item(from), this.item(to));
}
$Range.prototype.definesEvery = function(keys) {
    for (var i = 0; i < keys.getSize().value; i++) {
        if (this.defines(keys.item(Integer(i))) === getFalse()) {
            return getFalse();
        }
    }
    return getTrue();
}
$Range.prototype.definesAny = function(keys) {
    for (var i = 0; i < keys.getSize().value; i++) {
        if (this.defines(keys.item(Integer(i))) === getTrue()) {
            return getTrue();
        }
    }
    return getFalse();
}
$Range.prototype.defines = function(idx) { return Boolean$(idx.compare(this.getSize()) === smaller); }
$Range.prototype.getString = function() { return exports.String(this.first.getString().value + ".." + this.last.getString().value); }
$Range.prototype.equals = function(other) {
    if (!other) { return getFalse(); }
    var eqf = this.first.equals(other.getFirst());
    var eql = this.last.equals(other.getLast());
    return Boolean$(eqf === getTrue() && eql === getTrue());
}
$Range.prototype.getIterator = function() { return RangeIterator(this); }

function RangeIterator(range) {
    var that = new RangeIterator.$$;
    that.range = range;
    that.current = range.getFirst();
    return that;
}
initType(RangeIterator, 'ceylon.language.RangeIterator', IdentifiableObject, Iterator);
inheritProto(RangeIterator, IdentifiableObject, '$IdentifiableObject$');
var $RangeIterator = RangeIterator.$$;
$RangeIterator.prototype.next = function() {
    var rval = this.current;
    if (rval.equals($finished) === getTrue()) {
        return rval;
    } else if (rval.equals(this.range.getLast()) === getTrue()) {
        this.current = $finished;
    } else {
        this.current = this.range.next(this.current);
    }
    return rval;
}

function Singleton(elem) {
    var that = new Singleton.$$;
    that.value = [elem];
    that.elem = elem;
    return that;
}
initType(Singleton, 'ceylon.language.Singleton', Object$, Sequence);
inheritProto(Singleton, Object$, '$Object$');
inheritProto(Singleton, Sequence, '$Sequence$');
exports.Singleton=Singleton;
var $Singleton = Singleton.$$;
$Singleton.prototype.getString = function() { return exports.String("{ " + this.elem.getString().value + " }") }
$Singleton.prototype.item = function(index) {
    return index.value===0 ? this.value[0] : null;
}
$Singleton.prototype.getSize = function() { return Integer(1); }
$Singleton.prototype.getLastIndex = function() { return Integer(0); }
$Singleton.prototype.getFirst = function() { return this.elem; }
$Singleton.prototype.getLast = function() { return this.elem; }
$Singleton.prototype.getEmpty = function() { return $false; }
$Singleton.prototype.getRest = function() { return $empty; }
$Singleton.prototype.defines = function(idx) { return idx.equals(Integer(0)); }
$Singleton.prototype.getKeys = function() { return IntCategory(this); }
$Singleton.prototype.span = function(from, to) {
	if (to === undefined || to === null) to = from;
    return (from.equals(Integer(0)) === getTrue() || to.equals(Integer(0)) === getTrue()) ? this : $empty;
}
$Singleton.prototype.segment = function(idx, len) {
    if (idx.equals(Integer(0)) === getTrue() && len.compare(Integer(0)) === larger) {
        return this;
    }
    return $empty;
}
$Singleton.prototype.getIterator = function() { return SingletonIterator(this.elem); }

function SingletonIterator(elem) {
    var that = new SingletonIterator.$$;
    that.elem = elem;
    that.done = false;
    return that;
}
initType(SingletonIterator, 'ceylon.language.SingletonIterator', IdentifiableObject, Iterator);
inheritProto(SingletonIterator, IdentifiableObject, '$IdentifiableObject$');
var $SingletonIterator = SingletonIterator.$$;
$SingletonIterator.prototype.next = function() {
    if (this.done) {
        return $finished;
    }
    this.done = true;
    return this.elem;
}

function Entry(key, item) {
    var that = new Entry.$$;
    Object$(that);
    Equality(that);
    Void(that);
    that.key = key;
    that.item = item;
    return that;
}
initType(Entry, 'ceylon.language.Entry', Object$, Equality);
inheritProto(Entry, Object$, '$Object$');
exports.Entry=Entry;
var $Entry = Entry.$$;
$Entry.prototype.getString = function() {
    return exports.String(this.key.getString().value + "->" + this.item.getString().value)
}
$Entry.prototype.getKey = function() { return this.key }
$Entry.prototype.getItem = function() { return this.item }
$Entry.prototype.equals = function(other) {
    return Boolean$(other && this.key.equals(other.key) === getTrue() && this.item.equals(other.item) === getTrue());
}
$Entry.prototype.getHash = function() { Integer(this.key.getHash().value ^ this.item.getHash().value) }

    });
}(typeof define==='function' && define.amd ? 
    define : function (factory) {
    if (typeof exports!=='undefined') {
        factory(require, exports, module);
    } else {
        throw "no module loader";
    }
}));
