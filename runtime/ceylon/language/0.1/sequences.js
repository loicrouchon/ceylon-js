(function(define) {
    define(function(require, exports, module) {

var clang=require('./types');

var $Sequence = clang.Sequence.$$;
$Sequence.prototype.getEmpty = function() { return clang.getFalse() }
$Sequence.prototype.getSize = function() { return clang.Integer(this.getLastIndex()+1) }
$Sequence.prototype.defines = function(index) { return clang.Boolean(index.value<=this.getLastIndex().value) }

var $ArraySequence = clang.ArraySequence.$$;
$ArraySequence.prototype.getString = function() {
	if (this.value.length === 0) {
		return clang.String("{}");
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
        desc += clang.exists(item) === clang.getTrue() ? item.getString().value : "null";
    }
    return clang.String(desc +" }");
}
$ArraySequence.prototype.item = function(index) {
    var result = this.value[index.value];
    return result!==undefined ? result:null;
}
$ArraySequence.prototype.getSize = function() { return clang.Integer(this.value.length) }
$ArraySequence.prototype.getEmpty = function() { return this.value.length > 0 ? clang.getFalse() : clang.getTrue(); }
$ArraySequence.prototype.getLastIndex = function() { return this.getSize().getPredecessor(); }
$ArraySequence.prototype.getFirst = function() { return this.item(clang.Integer(0)); }
$ArraySequence.prototype.getLast = function() { return this.item(this.getLastIndex()); }
$ArraySequence.prototype.defines = function(idx) { return clang.Boolean(idx.compare(this.getSize()) === clang.getSmaller()); }
$ArraySequence.prototype.segment = function(from, len) {
    var seq = [];
    if (len.compare(clang.Integer(0)) === clang.getLarger()) {
        var stop = from.plus(len).value;
        for (var i=from.value; i < stop; i++) {
            var x = this.item(clang.Integer(i));
            if (x !== clang.getNull()) { seq.push(x); }
        }
    }
    return clang.ArraySequence(seq);
}
$ArraySequence.prototype.span = function(from, to) {
    var fromIndex = clang.largest(clang.Integer(0),from).value;
    var toIndex = to === clang.getNull() || to === undefined ? this.getLastIndex().value : clang.smallest(to, this.getLastIndex()).value;
    var seq = [];
    if (fromIndex === toIndex) {
        return clang.Singleton(this.item(from));
    } else if (toIndex > fromIndex) {
        for (var i = fromIndex; i <= toIndex && this.defines(clang.Integer(i)) === clang.getTrue(); i++) {
            seq.push(this.item(clang.Integer(i)));
        }
    } else {
        //Negative span, reverse seq returned
        for (var i = fromIndex; i >= toIndex && this.defines(clang.Integer(i)) === clang.getTrue(); i--) {
            seq.push(this.item(clang.Integer(i)));
        }
    }
    return clang.ArraySequence(seq);
}
$ArraySequence.prototype.getRest = function() { return clang.ArraySequence(this.value.slice(1)); }
$ArraySequence.prototype.items = function(keys) {
    var seq = [];
    for (var i = 0; i < keys.getSize().value; i++) {
        var key = keys.item(clang.Integer(i));
        if (this.defines(key)) {
            seq.push(this.item(key));
        }
    }
    return clang.ArraySequence(seq);
}
$ArraySequence.prototype.definesEvery = function(keys) {
    for (var i = 0; i < keys.getSize().value; i++) {
        if (this.defines(keys.item(clang.Integer(i))) === clang.getFalse()) {
            return clang.getFalse();
        }
    }
    return clang.getTrue();
}
$ArraySequence.prototype.definesAny = function(keys) {
    for (var i = 0; i < keys.getSize().value; i++) {
        if (this.defines(keys.item(clang.Integer(i))) === clang.getTrue()) {
            return clang.getTrue();
        }
    }
    return clang.getFalse();
}
$ArraySequence.prototype.equals = function(other) {
    if (other && other.getSize().equals(this.getSize()) === clang.getTrue()) {
        for (var i = 0; i < this.getSize().value; i++) {
            var mine = this.item(clang.Integer(i));
            var theirs = other.item(clang.Integer(i));
            if (((mine === null) && theirs) || !(mine && mine.equals(theirs) === clang.getTrue())) {
                return clang.getFalse();
            }
        }
        return clang.getTrue();
    }
    return clang.getFalse();
}
$ArraySequence.prototype.getIterator = function() { return ArrayIterator(this.value); }
$ArraySequence.prototype.getKeys = function() { return IntCategory(this); }

function IntCategory(seq) {
    var that = new IntCategory.$$;
    that.seq = seq;
    return that;
}
clang.initType(IntCategory, 'ceylon.language.IntCategory', clang.IdentifiableObject, clang.Category);
clang.inheritProto(IntCategory, clang.IdentifiableObject, '$IdentifiableObject$');
var $IntCategory = IntCategory.$$;
$IntCategory.prototype.contains = function(k) {
    return this.seq.defines(k);
}
$IntCategory.prototype.containsEvery = function(keys) {
    var all = true;
    for (var i = 0; i < this.seq.value.length; i++) {
        all = all && this.seq.defines(keys.item(clang.Integer(i))).value;
    }
    return clang.Boolean(all);
}
$IntCategory.prototype.containsAny = function(keys) {
    for (var i = 0; i < this.seq.value.length; i++) {
        if (this.seq.defines(keys.item(clang.Integer(i))) == clang.getTrue()) {
            return clang.getTrue();
        }
    }
    return clang.getFalse();
}

function ArrayIterator(arr) {
    var that = new ArrayIterator.$$;
    that.array = arr;
    that.current = arr && arr.length ? arr[0] : clang.getExhausted();
    that.idx = 0;
    return that;
}
clang.initType(ArrayIterator, 'ceylon.language.ArrayIterator', clang.IdentifiableObject, clang.Iterator);
clang.inheritProto(ArrayIterator, clang.IdentifiableObject, '$IdentifiableObject$');
var $ArrayIterator = ArrayIterator.$$;
$ArrayIterator.prototype.next = function() {
    if (this.current === clang.getExhausted()) {
        return clang.getExhausted();
    }
    this.current = this.idx < this.array.length ? this.array[this.idx] : clang.getExhausted();
    this.idx++;
    return this.current;
}

var $SequenceBuilder = clang.SequenceBuilder.$$;
$SequenceBuilder.prototype.getSequence = function() { return clang.ArraySequence(this.seq); }
$SequenceBuilder.prototype.append = function(e) { this.seq.push(e); }
$SequenceBuilder.prototype.appendAll = function(arr) {
	if (arr && arr.value && arr.value.length) {
        for (var i = 0; i < arr.value.length; i++) {
            this.seq.push(arr.value[i]);
        }
    }
}
$SequenceBuilder.prototype.getSize = function() { return clang.Integer(this.seq.length); }
$SequenceBuilder.prototype.getEmpty = function() { return clang.Boolean(this.seq.length === 0); }

var $Singleton = clang.Singleton.$$;
$Singleton.prototype.getString = function() { return clang.String("{ " + this.elem.getString().value + " }") }
$Singleton.prototype.item = function(index) {
    return index.value===0 ? this.value[0] : null;
}
$Singleton.prototype.getSize = function() { return clang.Integer(1); }
$Singleton.prototype.getLastIndex = function() { return clang.Integer(0); }
$Singleton.prototype.getFirst = function() { return this.elem; }
$Singleton.prototype.getLast = function() { return this.elem; }
$Singleton.prototype.getEmpty = function() { return clang.getFalse(); }
$Singleton.prototype.getRest = function() { return $empty; }
$Singleton.prototype.defines = function(idx) { return idx.equals(clang.Integer(0)); }
$Singleton.prototype.getKeys = function() { return IntCategory(this); }
$Singleton.prototype.span = function(from, to) {
	if (to === undefined || to === null) to = from;
    return (from.equals(clang.Integer(0)) === clang.getTrue() || to.equals(clang.Integer(0)) === clang.getTrue()) ? this : $empty;
}
$Singleton.prototype.segment = function(idx, len) {
    if (idx.equals(clang.Integer(0)) === clang.getTrue() && len.compare(clang.Integer(0)) === clang.getLarger()) {
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
clang.initType(SingletonIterator, 'ceylon.language.SingletonIterator', clang.IdentifiableObject, clang.Iterator);
clang.inheritProto(SingletonIterator, clang.IdentifiableObject, '$IdentifiableObject$');
var $SingletonIterator = SingletonIterator.$$;
$SingletonIterator.prototype.next = function() {
    if (this.done) {
        return clang.getExhausted();
    }
    this.done = true;
    return this.elem;
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
