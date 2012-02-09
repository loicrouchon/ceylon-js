(function(define) {
    define(function(require, exports, module) {

var clang = require('ceylon/language/0.1/ceylon.language');

function String$(value,size) {
    var that = new String$.$$;
    that.value = value;
    that.codePoints = size;
    return that;
}
clang.initType(String$, 'ceylon.language.String', clang.Object, clang.List, clang.Comparable,
    clang.Ranged, clang.FixedSized, clang.Summable, clang.Castable, clang.Cloneable);
clang.inheritProto(String$, clang.Object, '$Object$');
exports.String=String$;
var $String = String$.$$;
$String.prototype.getString = function() { return this }
$String.prototype.toString = function() { return this.value }
$String.prototype.plus = function(other) {
    var size = this.codePoints + other.codePoints;
    return String$(this.value+other.value, isNaN(size)?undefined:size);
}
$String.prototype.equals = function(other) { return clang.Boolean(other && other.value===this.value) }
$String.prototype.compare = function(other) {
    var cmp = this.value.localeCompare(other.value);
    return cmp===0 ? clang.getEqual() : (cmp<0 ? clang.getSmaller():clang.getLarger());
}
$String.prototype.getUppercased = function() { return String$(this.value.toUpperCase()) }
$String.prototype.getLowercased = function() { return String$(this.value.toLowerCase()) }
$String.prototype.getSize = function() {
    if (this.codePoints===undefined) {
        this.codePoints = countCodepoints(this.value);
    }
    return clang.Integer(this.codePoints);
}
$String.prototype.getLastIndex = function() { return this.getSize().equals(clang.Integer(0)) === clang.getTrue() ? null : this.getSize().getPredecessor(); }
$String.prototype.span = function(from, to) {
	var lastIndex = this.getLastIndex();
	if (!lastIndex) return this; //it's empty
    var fromIndex = clang.largest(clang.Integer(0),from).value;
    var toIndex = to === clang.getNull() || to === undefined ? lastIndex.value : clang.smallest(to, lastIndex).value;
    if (fromIndex === toIndex) {
		return this.item(from).getString();
    } else if (toIndex > fromIndex) {
		//TODO optimize this
		var s = String$("");
        for (var i = fromIndex; i <= toIndex; i++) {
			s = s.plus(this.item(clang.Integer(i)).getString());
        }
		return s;
    } else {
        //Negative span, reverse seq returned
        //TODO optimize
        var s = String$("");
        for (var i = fromIndex; i >= toIndex; i--) {
            var x = this.item(clang.Integer(i));
			if (x !== null) s = s.plus(x.getString());
        }
		return s;
    }
}
$String.prototype.segment = function(from, len) {
	//TODO optimize
    var s = String$("");
    if (len.compare(clang.Integer(0)) === clang.getLarger()) {
        var stop = from.plus(len).value;
        for (var i=from.value; i < stop; i++) {
            var x = this.item(clang.Integer(i));
            if (x !== clang.getNull()) { s = s.plus(x.getString()); }
        }
    }
    return s;
}
$String.prototype.getEmpty = function() {
    return clang.Boolean(this.value.length===0);
}
$String.prototype.longerThan = function(length) {
    if (this.codePoints!==undefined) {return clang.Boolean(this.codePoints>length.value)}
    if (this.value.length <= length.value) {return clang.getFalse()}
    if (this.value.length<<1 > length.value) {return clang.getTrue()}
    this.codePoints = countCodepoints(this.value);
    return clang.Boolean(this.codePoints>length.value);
}
$String.prototype.shorterThan = function(length) {
    if (this.codePoints!==undefined) {return clang.Boolean(this.codePoints<length.value)}
    if (this.value.length < length.value) {return clang.getTrue()}
    if (this.value.length<<1 >= length.value) {return clang.getFalse()}
    this.codePoints = countCodepoints(this.value);
    return clang.Boolean(this.codePoints<length.value);
}
$String.prototype.getIterator = function() { return StringIterator(this.value) }
$String.prototype.item = function(index) {
    if (index<0 || index>=this.value.length) {return null}
    var i = 0;
    for (var count=0; count<index; count++) {
        if ((this.value.charCodeAt(i)&0xfc00) === 0xd800) {++i}
        if (++i >= this.value.length) {return null}
    }
    return Character(codepointFromString(this.value, i));
}
$String.prototype.getTrimmed = function() {
    // make use of the fact that all WS characters are single UTF-16 code units
    var from = 0;
    while (from<this.value.length && (this.value.charCodeAt(from) in $WS)) {++from}
    var to = this.value.length;
    if (from < to) {
        do {--to} while (from<to && (this.value.charCodeAt(to) in $WS));
        ++to;
    }
    if (from===0 && to===this.value.length) {return this}
    var result = String$(this.value.substring(from, to));
    if (this.codePoints !== undefined) {
        result.codePoints = this.codePoints - from - this.value.length + to;
    }
    return result;
}
$String.prototype.initial = function(length) {
    if (length.value >= this.codePoints) {return this}
    var count = 0;
    var i = 0;
    for (; i<this.value.length && count<length.value; ++i, ++count) {
        if ((this.value.charCodeAt(i)&0xfc00) === 0xd800) {++i}
    }
    if (i >= this.value.length) {
        this.codePoints = count;
        return this;
    }
    return String$(this.value.substr(0, i), count);
}
$String.prototype.terminal = function(length) {
    if (length.value >= this.codePoints) {return this}
    var count = 0;
    var i = this.value.length;
    for (; i>0 && count<length.value; ++count) {
        if ((this.value.charCodeAt(--i)&0xfc00) === 0xdc00) {--i}
    }
    if (i <= 0) {
        this.codePoints = count;
        return this;
    }
    return String$(this.value.substr(i), count);
}
$String.prototype.getHash = function() {
    if (this._hash === undefined) {
        for (var i = 0; i < this.value.length; i++) {
          var c = this.value.charCodeAt(i);
          this._hash += c + (this._hash << 10);
          this._hash ^= this._hash >> 6;
    }

    this._hash += this._hash << 3;
    this._hash ^= this._hash >> 11;
    this._hash += this._hash << 15;
    this._hash = this._hash & ((1 << 29) - 1);
  }
  return clang.Integer(this._hash);
}
$String.prototype.getFirst = function() {
    return this.item(clang.Integer(0));
}

function cmpSubString(str, subStr, offset) {
    for (var i=0; i<subStr.length; ++i) {
        if (str.charCodeAt(offset+i)!==subStr.charCodeAt(i)) {return clang.getFalse()}
    }
    return clang.getTrue();
}
$String.prototype.startsWith = function(str) {
    if (str.value.length > this.value.length) {return clang.getFalse()}
    return cmpSubString(this.value, str.value, 0);
}
$String.prototype.endsWith = function(str) {
    var start = this.value.length - str.value.length
    if (start < 0) {return clang.getFalse()}
    return cmpSubString(this.value, str.value, start);
}
$String.prototype.contains = function(sub) {
    var str;
    if (sub.constructor === $String) {str = sub.value}
    else if (sub.constructor !== $Character) {return clang.getFalse()}
    else {str = codepointToString(sub.value)}
    return clang.Boolean(this.value.indexOf(str) >= 0);
}
$String.prototype.getNormalized = function() {
    // make use of the fact that all WS characters are single UTF-16 code units
    var result = "";
    var len = 0;
    var first = true;
    var i1 = 0;
    while (i1 < this.value.length) {
        while (this.value.charCodeAt(i1) in $WS) {
            if (++i1 >= this.value.length) {return String$(result)}
        }
        var i2 = i1;
        var cc = this.value.charCodeAt(i2);
        do {
            ++i2;
            if ((cc&0xfc00) === 0xd800) {++i2}
            ++len;
            cc = this.value.charCodeAt(i2);
        } while (i2<this.value.length && !(cc in $WS));
        if (!first) {
            result += " ";
            ++len;
        }
        first = false;
        result += this.value.substring(i1, i2);
        i1 = i2+1;
    }
    return String$(result, len);
}
$String.prototype.firstOccurrence = function(sub) {
    if (sub.value.length == 0) {return clang.Integer(0)}
    var bound = this.value.length - sub.value.length;
    for (var i=0, count=0; i<=bound; ++count) {
        if (cmpSubString(this.value, sub.value, i) === clang.getTrue()) {return clang.Integer(count)}
        if ((this.value.charCodeAt(i++)&0xfc00) === 0xd800) {++i}
    }
    return null;
}
$String.prototype.lastOccurrence = function(sub) {
    if (sub.value.length == 0) {return clang.Integer(this.value.length>0 ? this.value.length-1 : 0)}
    for (var i=this.value.length-sub.value.length; i>=0; --i) {
        if (cmpSubString(this.value, sub.value, i) === clang.getTrue()) {
            for (var count=0; i>0; ++count) {
                if ((this.value.charCodeAt(--i)&0xfc00) === 0xdc00) {--i}
            }
            return clang.Integer(count);
        }
    }
    return null;
}
$String.prototype.firstCharacterOccurrence = function(subc) {
    for (var i=0, count=0; i<this.value.length; count++) {
        var cp = this.value.charCodeAt(i++);
        if (((cp&0xfc00) === 0xd800) && i<this.value.length) {
            cp = (cp<<10) + this.value.charCodeAt(i++) - 0x35fdc00;
        }
        if (cp === subc.value) {return clang.Integer(count)}
    }
    this.codePoints = count;
    return null;
}
$String.prototype.lastCharacterOccurrence = function(subc) {
    for (var i=this.value.length-1, count=0; i>=0; count++) {
        var cp = this.value.charCodeAt(i--);
        if (((cp%0xfc00) === 0xdc00) && i>=0) {
           cp = (this.value.charCodeAt(i--)<<10) + cp - 0x35fdc00;
        }
        if (cp === subc.value) {
            if (this.codePoints === undefined) {this.codePoints = countCodepoints(this.value)}
            return clang.Integer(this.codePoints - count - 1);
        }
    }
    this.codePoints = count;
    return null;
}
$String.prototype.getCharacters = function() {
    //we can cheat and add the required behavior to String, avoiding the need to create a Sequence...
    //TODO: this probably doesn't work completely because String doesn't satisfy
    //      all required interfaces, so "if(is ...)" will be false when it shouldn't.
    return this.value.length>0 ? this:$empty;
}
$String.prototype.getFirst = function() { return this.getSize().value>0?this.item(clang.Integer(0)):null; }
$String.prototype.getLast = function() { return this.getSize().value>0?this.item(clang.Integer(this.getSize().getPredecessor())):null; }
$String.prototype.getKeys = function() {
    //TODO implement!!!
    return this.getSize().value > 0 ? clang.Range(clang.Integer(0), this.getSize().getPredecessor()) : $empty;
}
$String.prototype.join = function(strings) {
    if (strings===undefined || strings.value.length===0) {return String$("", 0)}
    if (this.codePoints === undefined) {this.codePoints = countCodepoints(this.value)}
    var str = strings.value[0];
    var result = str.value;
    var len = str.codePoints;
    for (var i=1; i<strings.value.length; ++i) {
        str = strings.value[i];
        result += this.value;
        result += str.value;
        len += this.codePoints + str.codePoints;
    }
    return String$(result, isNaN(len)?undefined:len);
}
$String.prototype.split = function(seps, discard) {
    var sepChars = $WS;
    if (seps!==undefined && seps!==null) {
        sepChars = {}
        var it = seps.getIterator();
        var c; while ((c=it.next()) !== clang.getExhausted()) {sepChars[c.value] = true}
    }
    if (discard === undefined) {discard = false}
    
    //TODO: return an iterable which determines the next token on demand
    var tokens = [];
    var tokenBegin = 0;
    var tokenBeginCount = 0;
    for (var i=0, count=0; i<this.value.length;) {
        var j = i;
        var cp = this.value.charCodeAt(i++);
        if ((cp&0xfc00)===0xd800 && i<this.value.length) {
            cp = (cp<<10) + this.value.charCodeAt(i++) - 0x35fdc00;
        }
        ++count;
        if (cp in sepChars) {
            if (tokenBegin != j) {
                tokens.push(String$(this.value.substring(tokenBegin, j), count-tokenBeginCount-1))
            }
            if (!discard) {tokens.push(String$(this.value.substring(j, i), 1))}
            tokenBegin = i;
            tokenBeginCount = count;
        }
    }
    if (tokenBegin != i) {
        tokens.push(String$(this.value.substring(tokenBegin, i), count-tokenBeginCount))
    }
    this.codePoints = count;
    return clang.ArraySequence(tokens);
}
$String.prototype.getReversed = function() {
    var result = "";
    for (var i=this.value.length; i>0;) {
        var cc = this.value.charCodeAt(--i);
        if ((cc&0xfc00)!==0xdc00 || i===0) {
            result += this.value.charAt(i);
        } else {
            result += this.value.substr(--i, 2);
        }
    }
    return String$(result);
}
$String.prototype.replace = function(sub, repl) {
    return String$(this.value.replace(new RegExp(sub.value, 'g'), repl.value));
}
$String.prototype.repeat = function(times) {
    var sb = clang.StringBuilder();
    for (var i = 0; i < times.value; i++) {
        sb.append(this);
    }
    return sb.getString();
}

function StringIterator(string) {
    var that = new StringIterator.$$;
    that.string = string;
    that.index = 0;
    return that;
}
clang.initType(StringIterator, 'ceylon.language.StringIterator', clang.IdentifiableObject, clang.Iterator);
clang.inheritProto(StringIterator, clang.IdentifiableObject, '$IdentifiableObject$');
var $StringIterator = StringIterator.$$;
$StringIterator.prototype.next = function() {
    if (this.index >= this.string.length) { return clang.getExhausted() }
    var first = this.string.charCodeAt(this.index++);
    if ((first&0xfc00) !== 0xd800 || this.index >= this.string.length) {
        return Character(first);
    }
    return Character((first<<10) + this.string.charCodeAt(this.index++) - 0x35fdc00);
}

function countCodepoints(str) {
    var count = 0;
    for (var i=0; i<str.length; ++i) {
        ++count;
        if ((str.charCodeAt(i)&0xfc00) === 0xd800) {++i}
    }
    return count;
}
function codepointToString(cp) {
    if (cp <= 0xffff) {
        return String.fromCharCode(cp);
    }
    return String.fromCharCode((cp>>10)+0xd7c0, (cp&0x3ff)+0xdc00);
}
function codepointFromString(str, index) {
    var first = str.charCodeAt(index);
    if ((first&0xfc00) !== 0xd800) {return first}
    var second = str.charCodeAt(index+1);
    return isNaN(second) ? first : ((first<<10) + second - 0x35fdc00);
}

function Character(value) {
    var that = new Character.$$;
    that.value = value;
    return that;
}
clang.initType(Character, 'ceylon.language.Character', clang.Object, clang.Comparable);
clang.inheritProto(Character, clang.Object, '$Object$');
exports.Character=Character;
var $Character = Character.$$;
$Character.prototype.getString = function() { return String$(codepointToString(this.value)) }
$Character.prototype.equals = function(other) {
    return clang.Boolean(other.constructor===$Character && other.value===this.value);
}
$Character.prototype.getHash = function() {return clang.Integer(this.value)}
$Character.prototype.compare = function(other) {
    return this.value===other.value ? clang.getEqual()
                                    : (this.value<other.value ? clang.getSmaller():clang.getLarger());
}
$Character.prototype.getUppercased = function() {
    var ucstr = codepointToString(this.value).toUpperCase();
    return Character(codepointFromString(ucstr, 0));
}
$Character.prototype.getLowercased = function() {
    var lcstr = codepointToString(this.value).toLowerCase();
    return Character(codepointFromString(lcstr, 0));
}
$Character.prototype.getTitlecased = function() {
    var tc = $toTitlecase[this.value];
    return tc===undefined ? this.getUppercased() : Character(tc);
}
var $WS={0x9:true, 0xa:true, 0xb:true, 0xc:true, 0xd:true, 0x20:true, 0x85:true, 0xa0:true,
    0x1680:true, 0x180e:true, 0x2028:true, 0x2029:true, 0x202f:true, 0x205f:true, 0x3000:true}
for (var i=0x2000; i<=0x200a; i++) { $WS[i]=true }
var $digit={0x30:true, 0x660:true, 0x6f0:true, 0x7c0:true, 0x966:true, 0x9e6:true, 0xa66:true,
    0xae6:true, 0xb66:true, 0xbe6:true, 0xc66:true, 0xce6:true, 0xd66:true, 0xe50:true,
    0xed0:true, 0xf20:true, 0x1040:true, 0x1090:true, 0x17e0:true, 0x1810:true, 0x1946:true,
    0x19d0:true, 0x1a80:true, 0x1a90:true, 0x1b50:true, 0x1bb0:true, 0x1c40:true, 0x1c50:true,
    0xa620:true, 0xa8d0:true, 0xa900:true, 0xa9d0:true, 0xaa50:true, 0xabf0:true, 0xff10:true,
    0x104a0:true, 0x11066:true, 0x110f0:true, 0x11136:true, 0x111d0:true, 0x116c0:true}
var $titlecase={
    0x1c5: [0x1c4, 0x1c6], 0x1c8: [0x1c7, 0x1c9], 0x1cb: [0x1ca, 0x1cc], 0x1f2: [0x1f1, 0x1f3],
    0x1f88: [undefined, 0x1f80], 0x1f89: [undefined, 0x1f81], 0x1f8a: [undefined, 0x1f82],
    0x1f8b: [undefined, 0x1f83], 0x1f8c: [undefined, 0x1f84], 0x1f8d: [undefined, 0x1f85],
    0x1f8e: [undefined, 0x1f86], 0x1f8f: [undefined, 0x1f87], 0x1f98: [undefined, 0x1f90],
    0x1f99: [undefined, 0x1f91], 0x1f9a: [undefined, 0x1f92], 0x1f9b: [undefined, 0x1f93],
    0x1f9c: [undefined, 0x1f94], 0x1f9d: [undefined, 0x1f95], 0x1f9e: [undefined, 0x1f96],
    0x1f9f: [undefined, 0x1f97], 0x1fa8: [undefined, 0x1fa0], 0x1fa9: [undefined, 0x1fa1],
    0x1faa: [undefined, 0x1fa2], 0x1fab: [undefined, 0x1fa3], 0x1fac: [undefined, 0x1fa4],
    0x1fad: [undefined, 0x1fa5], 0x1fae: [undefined, 0x1fa6], 0x1faf: [undefined, 0x1fa7],
    0x1fbc: [undefined, 0x1fb3], 0x1fcc: [undefined, 0x1fc3], 0x1ffc: [undefined, 0x1ff3]
}
var $toTitlecase={
    0x1c6:0x1c5, 0x1c7:0x1c8, 0x1ca:0x1cb, 0x1f1:0x1f2,
    0x1c4:0x1c5, 0x1c9:0x1c8, 0x1cc:0x1cb, 0x1f3:0x1f2, 0x1f80:0x1f88, 0x1f81:0x1f89, 0x1f82:0x1f8a,
    0x1f83:0x1f8b, 0x1f84:0x1f8c, 0x1f85:0x1f8d, 0x1f86:0x1f8e, 0x1f87:0x1f8f, 0x1f90:0x1f98,
    0x1f91:0x1f99, 0x1f92:0x1f9a, 0x1f93:0x1f9b, 0x1f94:0x1f9c, 0x1f95:0x1f9d, 0x1f96:0x1f9e,
    0x1f97:0x1f9f, 0x1fa0:0x1fa8, 0x1fa1:0x1fa9, 0x1fa2:0x1faa, 0x1fa3:0x1fab, 0x1fa4:0x1fac,
    0x1fa5:0x1fad, 0x1fa6:0x1fae, 0x1fa7:0x1faf, 0x1fb3:0x1fbc, 0x1fc3:0x1fcc, 0x1ff3:0x1ffc
}
$Character.prototype.getWhitespace = function() { return clang.Boolean(this.value in $WS) }
$Character.prototype.getControl = function() { return clang.Boolean(this.value<32 || this.value===127) }
$Character.prototype.getDigit = function() {
    var check = this.value & 0xfffffff0;
    if (check in $digit) {
        return clang.Boolean((this.value&0xf) <= 9);
    }
    if ((check|6) in $digit) {
        return clang.Boolean((this.value&0xf) >= 6);
    }
    return clang.Boolean(this.value>=0x1d7ce && this.value<=0x1d7ff);
}
$Character.prototype.getInteger = function() { return clang.Integer(this.value); }
$Character.prototype.getUppercase = function() {
    var str = codepointToString(this.value);
    return clang.Boolean(str.toLowerCase()!==str && !(this.value in $titlecase));
}
$Character.prototype.getLowercase = function() {
    var str = codepointToString(this.value);
    return clang.Boolean(str.toUpperCase()!==str && !(this.value in $titlecase));
}
$Character.prototype.getTitlecase = function() {return clang.Boolean(this.value in $titlecase)}
$Character.prototype.getLetter = function() {
    //TODO: this captures only letters that have case
    var str = codepointToString(this.value);
    return clang.Boolean(str.toUpperCase()!==str || str.toLowerCase()!==str || (this.value in $titlecase));
}
$Character.prototype.getSuccessor = function() {
    var succ = this.value+1;
    if ((succ&0xf800) === 0xd800) {return Character(0xe000)}
    return Character((succ<=0x10ffff) ? succ:0);
}
$Character.prototype.getPredecessor = function() {
    var succ = this.value-1;
    if ((succ&0xf800) === 0xd800) {return Character(0xd7ff)}
    return Character((succ>=0) ? succ:0x10ffff);
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
