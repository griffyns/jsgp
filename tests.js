f = require('./js.js');

describe("Good parts test", function() {
    it("basic functions", function() {
        expect(f.add(3, 4)).toEqual(7);
        expect(f.sub(3, 4)).toEqual(-1);
        expect(f.mul(3, 4)).toEqual(12);
    });
    it("identityf", function() {
        var three = f.identityf(3);
        expect(three()).toEqual(3);
        var four = f.identityf(4);
        expect(four()).toEqual(4);
    });
    it('addf - adds from two invocations', function() {
    	expect(f.addf(3)(4)).toEqual(7);
    });
    it('liftf', function() {
    	var addf = f.liftf(f.add);
    	expect(f.addf(3)(4)).toEqual(7);
    	expect(f.liftf(f.mul)(5)(6)).toEqual(30);
    });
    it('curry', function() {
    	var add3 = f.curry(f.add, 3);
    	expect(add3(4)).toEqual(7);
    	expect(f.curry(f.mul,5)(6)).toEqual(30);
    });
    it('inc', function() {
    	expect(f.inc(5)).toEqual(6);
    	expect(f.inc(f.inc(5))).toEqual(7);
    });
    it('twice', function() {
    	expect(f.twice(f.add)(11)).toEqual(22);
    	expect(f.twice(f.mul)(11)).toEqual(121);
    });
    it('reverse', function() {
    	expect(f.reverse(f.sub)(3,2)).toEqual(-1);
    });
    it('composeu', function() {
    	expect(f.composeu(f.twice(f.add), f.twice(f.mul))(5)).toEqual(100);
    });
    it('from', function () {
    	var index = f.from(0);
    	expect(index()).toEqual(0);
    	expect(index()).toEqual(1);
    });
    it('to', function () {
    	var index = f.to(f.from(1), 3);
    	expect(index()).toEqual(1);
    	expect(index()).toEqual(2);
    	expect(index()).toEqual(undefined);
    });
    it('fromTo', function () {
    	var index = f.fromTo(0, 3);
    	expect(index()).toEqual(0);
    	expect(index()).toEqual(1);
    	expect(index()).toEqual(2);
    	expect(index()).toEqual(undefined);
    });
    it('element', function () {
    	var ele = f.element(['a','b','c','d'],f.fromTo(1,3));
    	expect(ele()).toEqual('b');
    	expect(ele()).toEqual('c');
    	expect(ele()).toEqual(undefined);
    });

    it('element', function () {
    	var ele = f.element(['a','b','c','d']);
    	expect(ele()).toEqual('a');
    	expect(ele()).toEqual('b'); 	
    	expect(ele()).toEqual('c');
    	expect(ele()).toEqual('d');
    	expect(ele()).toEqual(undefined);
    });
    it('collect', function () {
    	var array = [],
    		col = f.collect(f.fromTo(0,2), array);
    	expect(col()).toEqual(0);
    	expect(col()).toEqual(1);
    	expect(col()).toEqual(undefined);
    	expect(array).toEqual([0,1]);
    });
    it('filter', function () {
    	var fil = f.filter(f.fromTo(0,5),
    		function third(value) {
    			return (value % 3) === 0;
    		});
    	expect(fil()).toEqual(0);
    	expect(fil()).toEqual(3);
    	expect(fil()).toEqual(undefined);
    });
    it('concat', function () {
    	var con = f.concat(f.fromTo(0,3),f.fromTo(0,2));
    	expect(con()).toEqual(0);
    	expect(con()).toEqual(1);
    	expect(con()).toEqual(2);
    	expect(con()).toEqual(0);
    	expect(con()).toEqual(1);
    	expect(con()).toEqual(undefined);
    });
    it('gensymf', function () {
    	var geng = f.gensymf('G'),
    		genh = f.gensymf('H'),
    		gen1 = f.gensymf(1);
    	expect(geng()).toEqual('G1');
    	expect(genh()).toEqual('H1');
    	expect(geng()).toEqual('G2');
    	expect(genh()).toEqual('H2');
    	expect(gen1()).toEqual('11');
    });
    it('fibonaccif', function() {
    	var fib = f.fibonaccif(0,1);
    	expect(fib()).toEqual(0);
    	expect(fib()).toEqual(1);
    	expect(fib()).toEqual(1);
    	expect(fib()).toEqual(2);
    	expect(fib()).toEqual(3);
    	expect(fib()).toEqual(5);	
    });
    it('counter', function () {
    	var object = f.counter(10),
    	up = object.up,
    	down = object.down;
    	expect(up()).toEqual(11);
    	expect(down()).toEqual(10);
    	expect(down()).toEqual(9);
    	expect(up()).toEqual(10);
    });
    it('revocable', function () {
    	var rev = f.revocable(f.add),
    	add_rev = rev.invoke;
    	expect(add_rev(3,4)).toEqual(7);
    	rev.revoke();
    	add_rev(5, 7); // undefined 
    });
    it('addm', function () {
    	expect(JSON.stringify(f.addm(f.m(3),f.m(4)))).toEqual(
    		'{"value":7,"source":"(3+4)"}'
    	);
    });
    it('liftm', function () {
    	var addm = f.liftm(f.add,"+");
    	expect(addm(f.m(3),f.m(4))).toEqual({"value":7,"source":"(3+4)"});
    });
    it('liftm', function () {
    	var addm = f.liftm(f.add,"+");
    	expect(addm(3,4)).toEqual({"value":7,"source":"(3+4)"});
    });
    it('exp', function () {
    	var sae = [f.mul, 5, 11];
    	expect(f.exp(sae)).toEqual(55);
    	expect(f.exp(42)).toEqual(42);
    });
    it('exp', function () {
    	var nae = [
    		Math.sqrt,
    		[
    			f.add,
    			[f.square, 3],
    			[f.square, 4]
    		]
    	];
    	expect(f.exp(nae)).toEqual(5);
    });
    it('addg', function () {
    	expect(f.addg()).toEqual(undefined);
    	expect(f.addg(2)()).toEqual(2);
    	expect(f.addg(2)(7)()).toEqual(9);
    	expect(f.addg(3)(0)(4)()).toEqual(7);
    	expect(f.addg(1)(2)(4)(8)()).toEqual(15);
    });

    it('liftg', function () {
    	expect(f.liftg(f.mul)()).toEqual(undefined);
    });
    it('arrayg', function () {
    	expect(f.arrayg()).toEqual([]);
    	expect(f.arrayg(3)()).toEqual([3]);
    	expect(f.arrayg(3)(4)(5)()).toEqual([3,4,5]);
    });
    it('continuize', function () {
    	var sqrtc = f.continuize(Math.sqrt);
    	expect(sqrtc(f.inc,81)).toEqual(10);
    });
    it('vector', function() {
    	myvector = f.vector();
    	myvector.store(0,'a');
    	myvector.store(1,'b');
    	myvector.store(2,'c');
    	var stash;
    	myvector.store('push',function () { stash = this;});
    	myvector.append();
    	//console.log(stash);
    	
    })

});