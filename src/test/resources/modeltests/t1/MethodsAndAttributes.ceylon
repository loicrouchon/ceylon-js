//Test with only top-level methods and attributes
void simple1() {}
shared Integer simple2() { return 0; }
void simple3(Integer p1, String p2) {}
shared void defaulted1(Integer p1, Integer p2=5) {}
void sequenced1(Integer p1, String... p2) {}
void sequencedDefaulted(String s="x", Integer... ints) {}
shared Integer mpl1(String a)(String b) {
  return a.size + b.size;
}
String mpl2(Integer a)(Object b)(Float c) {
  return a.string + ":" + b + ":" + c.string;
}
doc "A nested function. Should the doc be in the metamodel as well?"
shared Integer nested(String s) {
  shared String f() {
    return s + "!";
  }
  return f().size;
}

//parameter types
void parmtypes1(Sequence<Integer> x) {}
void parmtypes2(Sequence<Iterable<String>> xx) {}
shared Sequence<String> parmtypes3() {
  return { "a", "b" };
}
shared SomethingElse parmtypes4<Something, out SomethingElse>(Something v)
    given Something satisfies Comparable<Something>
    given SomethingElse satisfies Something {
  throw;
}
shared void parmtypes5<Value>(Value x)
    given Value of Integer|Float {
}

//attributes
Integer i1 = 5;
shared String s1 = "hey";
variable Float pi := 3.14;
shared variable Sequence<Integer> seq := { 5 };