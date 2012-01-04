var $$$cl15=require('ceylon/language/0.1/ceylon.language');

//ClassDefinition Pair at types.ceylon (1:0-7:0)
function $Pair(){}
for(var $ in CeylonObject.prototype){$Pair.prototype[$]=CeylonObject.prototype[$]}
for(var $ in CeylonObject.prototype){$Pair.prototype[$+'$']=CeylonObject.prototype[$]}

//AttributeGetterDefinition string at types.ceylon (4:4-6:4)
$Pair.prototype.getString=function getString(){
    var $$pair=this;
    return $$$cl15.String("(").plus($$pair.x.getString()).plus($$$cl15.String(", ")).plus($$pair.y.getString()).plus($$$cl15.String(")"));
}
function Pair(x, y, $$pair){
    if ($$pair===undefined)$$pair=new $Pair;
    $$pair.x=x;
    $$pair.y=y;
    return $$pair;
}

//ClassDefinition Complex at types.ceylon (9:0-17:0)
function $Complex(){}
for(var $ in $Pair.prototype){$Complex.prototype[$]=$Pair.prototype[$]}
for(var $ in $Pair.prototype){$Complex.prototype[$+'$']=$Pair.prototype[$]}

//AttributeGetterDefinition string at types.ceylon (11:4-13:4)
$Complex.prototype.getString=function getString(){
    var $$complex=this;
    return $$complex.x.getString().plus($$$cl15.String("+")).plus($$complex.y.getString()).plus($$$cl15.String("i"));
}

//AttributeGetterDefinition pairString at types.ceylon (14:4-16:4)
$Complex.prototype.getPairString=function getPairString(){
    var $$complex=this;
    return $$complex.getString$();
}
function Complex(x, y, $$complex){
    if ($$complex===undefined)$$complex=new $Complex;
    Pair($$complex.x,$$complex.y,$$complex);
    $$complex.x=x;
    $$complex.y=y;
    return $$complex;
}

//InterfaceDefinition List at types.ceylon (19:0-24:0)
function $List(){}

//AttributeGetterDefinition empty at types.ceylon (21:4-23:4)
$List.prototype.getEmpty=function getEmpty(){
    var $$list=this;
    return $$list.getSize().equals($$$cl15.Integer(0));
}
function List($$list){
    if ($$list===undefined)$$list=new $List;
    return $$list;
}

//ClassDefinition ConcreteList at types.ceylon (26:0-34:0)
function $ConcreteList(){}
for(var $ in CeylonObject.prototype){$ConcreteList.prototype[$]=CeylonObject.prototype[$]}
for(var $ in CeylonObject.prototype){$ConcreteList.prototype[$+'$']=CeylonObject.prototype[$]}
for(var $ in $List.prototype){$ConcreteList.prototype[$]=$List.prototype[$]}
for(var $ in $List.prototype){$ConcreteList.prototype[$+'$']=$List.prototype[$]}

//AttributeGetterDefinition size at types.ceylon (28:4-30:4)
$ConcreteList.prototype.getSize=function getSize(){
    var $$concreteList=this;
    return $$$cl15.Integer(0);
}

//AttributeGetterDefinition empty at types.ceylon (31:4-33:4)
$ConcreteList.prototype.getEmpty=function getEmpty(){
    var $$concreteList=this;
    return $$$cl15.getTrue();
}
function ConcreteList(xs, $$concreteList){
    if ($$concreteList===undefined)$$concreteList=new $ConcreteList;
    List($$concreteList);
    return $$concreteList;
}

//ClassDefinition Couple at types.ceylon (36:0-41:0)
function $Couple(){}
for(var $ in $Pair.prototype){$Couple.prototype[$]=$Pair.prototype[$]}
for(var $ in $Pair.prototype){$Couple.prototype[$+'$']=$Pair.prototype[$]}

//AttributeDeclaration x at types.ceylon (39:4-39:18)
$Couple.prototype.getX=function getX(){
    return this.x;
}

//AttributeDeclaration y at types.ceylon (40:4-40:18)
$Couple.prototype.getY=function getY(){
    return this.y;
}
function Couple(x, y, $$couple){
    if ($$couple===undefined)$$couple=new $Couple;
    Pair(x,y,$$couple);
    
    //AttributeDeclaration x at types.ceylon (39:4-39:18)
    $$couple.x=x;
    
    //AttributeDeclaration y at types.ceylon (40:4-40:18)
    $$couple.y=y;
    return $$couple;
}

//MethodDefinition test at types.ceylon (43:0-50:0)
function test(){
    
    //AttributeDeclaration pair at types.ceylon (44:4-44:39)
    var $pair=Pair($$$cl15.String("hello"),$$$cl15.String("world"));
    function getPair(){
        return $pair;
    }
    $$$cl15.print(getPair());
    
    //AttributeDeclaration zero at types.ceylon (46:4-46:34)
    var $zero=Complex($$$cl15.Float(0.0),$$$cl15.Float(0.0));
    function getZero(){
        return $zero;
    }
    $$$cl15.print(getZero());
    $$$cl15.print(getZero().getPairString());
    $$$cl15.print(ConcreteList().getEmpty());
}
this.test=test;
