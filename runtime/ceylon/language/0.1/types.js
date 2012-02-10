(function(define) {
    define(function(require, exports, module) {

//the Ceylon language module
function print(line) { console.log(line.getString().value) }
exports.print=print;

function exists(value) {
    return value === getNull() || value === undefined ? $false : $true;
}
exports.exists=exists;

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
$Object.prototype.getString=function() { String$(Object.prototype.toString.apply(this)) };
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
function Invertable(wat) {
    return wat;
}
initType(Invertable, 'ceylon.language.Invertable');
exports.Invertable=Invertable;
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
function Number$(wat) {
    return wat;
}
initType(Number$, 'ceylon.language.Number', Equality);
exports.Number=Number$;
function Numeric(wat) {
    return wat;
}
initType(Numeric, 'ceylon.language.Numeric', Number$, Comparable, Summable, Invertable);
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

function Integer(value) {
    var that = new Integer.$$;
    that.value = value;
    return that;
}
initType(Integer, 'ceylon.language.Integer', Object$, Castable, Integral, Numeric);
inheritProto(Integer, Object$, '$Object$');
exports.Integer=Integer;

function Float(value) {
    var that = new Float.$$;
    that.value = value;
    return that;
}
initType(Float, 'ceylon.language.Float', Object$, Castable, Numeric);
inheritProto(Float, Object$, '$Object$');
exports.Float=Float;

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
           : (this.cause!==null ? this.cause.getMessage() : String$("", 0));
}
$Exception.prototype.getString = function() {
    return String$('Exception "' + this.getMessage().value + '"');
}

function String$(value,size) {
    var that = new String$.$$;
    that.value = value;
    that.codePoints = size;
    return that;
}
initType(String$, 'ceylon.language.String', Object$, List, Comparable,
    Ranged, FixedSized, Summable, Castable, Cloneable);
inheritProto(String$, Object$, '$Object$');
exports.String=String$;

function Character(value) {
    var that = new Character.$$;
    that.value = value;
    return that;
}
initType(Character, 'ceylon.language.Character', Object$, Comparable);
inheritProto(Character, Object$, '$Object$');
exports.Character=Character;

function StringBuilder() {
    var that = new StringBuilder.$$;
    that.value = "";
    return that;
}
initType(StringBuilder, 'ceylon.language.StringBuilder', IdentifiableObject);
inheritProto(StringBuilder, IdentifiableObject, '$IdentifiableObject$');
exports.StringBuilder=StringBuilder;
var $StringBuilder = StringBuilder.$$;
$StringBuilder.prototype.getString = function() { return String$(this.value); }
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


function getTrue() { return $true; }
function getFalse() { return $false; }
exports.getTrue=getTrue;
exports.getFalse=getFalse;

function Finished() {}
initType(Finished, 'ceylon.language.Finished', IdentifiableObject);
inheritProto(Finished, IdentifiableObject, '$IdentifiableObject$');
function getExhausted() { return $finished; }
exports.getExhausted=getExhausted;

function Comparison(name) {
    var that = new Comparison.$$;
    that.name = String$(name);
    return that;
}
initType(Comparison, 'ceylon.language.Comparison', IdentifiableObject);
inheritProto(Comparison, IdentifiableObject, '$IdentifiableObject$');
exports.Comparison=Comparison;
var $Comparison = Comparison.$$;
$Comparison.prototype.getString = function() { return this.name }

function Sequence($$sequence) {
    return $$sequence;
}
initType(Sequence, 'ceylon.language.Sequence', List, Some, Cloneable, Ranged);
exports.Sequence=Sequence;

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
$Empty.prototype.getString = function() { return String$("{}"); }
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


function ArraySequence(value) {
    var that = new ArraySequence.$$;
    that.value = value;
    return that;
}
initType(ArraySequence, 'ceylon.language.ArraySequence', IdentifiableObject, Sequence);
inheritProto(ArraySequence, IdentifiableObject, '$IdentifiableObject$');
inheritProto(ArraySequence, Sequence, '$Sequence$');
exports.ArraySequence=ArraySequence;

function SequenceBuilder() {
    var that = new SequenceBuilder.$$;
    that.seq = [];
    return that;
}
initType(SequenceBuilder, 'ceylon.language.SequenceBuilder', IdentifiableObject, Sized);
inheritProto(SequenceBuilder, IdentifiableObject, '$IdentifiableObject$');
exports.SequenceBuilder=SequenceBuilder;

function SequenceAppender(other) {
	var that = new SequenceAppender.$$;
	that.seq = [];
	that.appendAll(other);
	return that;
}
initType(SequenceAppender, 'ceylon.language.SequenceAppender', SequenceBuilder);
exports.SequenceAppender=SequenceAppender;

function Range(first, last) {
    var that = new Range.$$;
    that.first = first;
    that.last = last;
    var index = 0;
    var x = first;
    var dec = first.compare(last) === getLarger();
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
    return Boolean$(this.first.compare(this.last) === getLarger());
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
    var rval = this.getDecreasing() === getTrue() ? ((compf === equal || compf === getSmaller()) && (compl === equal || compl === getLarger())) : ((compf === equal || compf === getLarger()) && (compl === equal || compl === getSmaller()));
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
    if (step.compare(Integer(0)) !== getLarger()) {
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
    if (len.compare(Integer(0)) !== getLarger()) return $empty;
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
        if (from.compare(to) === getLarger() && this.defines(to) === $true) {
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
$Range.prototype.defines = function(idx) { return Boolean$(idx.compare(this.getSize()) === getSmaller()); }
$Range.prototype.getString = function() { return String$(this.first.getString().value + ".." + this.last.getString().value); }
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
    return String$(this.key.getString().value + "->" + this.item.getString().value)
}
$Entry.prototype.getKey = function() { return this.key }
$Entry.prototype.getItem = function() { return this.item }
$Entry.prototype.equals = function(other) {
    return Boolean$(other && this.key.equals(other.key) === getTrue() && this.item.equals(other.item) === getTrue());
}
$Entry.prototype.getHash = function() { Integer(this.key.getHash().value ^ this.item.getHash().value) }

var $true = new Boolean$.$$;
$true.string = String$("true");
$true.getString = function() {return this.string}
var $false = new Boolean$.$$;
$false.string = String$("false");
$false.getString = function() {return this.string}
var $finished = new Finished.$$;
$finished.getString = function() {return this.string}
$finished.string = String$("exhausted");

var larger = Comparison("larger");
var smaller = Comparison("smaller");
var equal = Comparison("equal");
function getLarger() { return larger }
function getSmaller() { return smaller }
function getEqual() { return equal }
function largest(x, y) { return x.compare(y) === larger ? x : y }
function smallest(x, y) { return x.compare(y) === smaller ? x : y }
exports.getLarger=getLarger;
exports.getSmaller=getSmaller;
exports.getEqual=getEqual;
exports.largest=largest;
exports.smallest=smallest;


    });
}(typeof define==='function' && define.amd ? 
    define : function (factory) {
    if (typeof exports!=='undefined') {
        factory(require, exports, module);
    } else {
        throw "no module loader";
    }
}));
