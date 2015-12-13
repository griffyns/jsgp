function add(x,y) {
	return x+y;
};

function sub(x,y) {
	return x-y;
};

function mul(x,y) {
	return x*y;
};

function identityf(x) {
	return function() { return x; };
};

function addf(x) {
	return function (y) { return x+y; };
};

function liftf(func) {
	return function (x) {
			return function (y) {
				return func(x,y);
			}
	};
};

function curry(func,param) {
	return (liftf(func)(param));
};

var inc = curry(add,1);
var inc1 = curry(add,1);
var inc2 = (liftf(add)(1));
var inc3 = addf(1);

function twice(func) {
	return function (x) {
		return func(x,x);
	}
};

function reverse(func) {
	return function (y,x) {
		return func(x,y);
	}
};

var doubl = twice(add);
var square = twice(mul);

function composeu(func1, func2) {
	return function(x) {
		return(func2(func1(x)));
	};
};

function composeb(func1, func2) {
	return function(x,y,z) {
		return(func2(func1(x,y),z));
	};
};

function limit(func,lmt) {
	return function(x,y) {
		if (lmt >= 1) {
			lmt -= 1;
			return	func(x,y);
		}
	}
	return undefined;
};

function from(start) {
	return function () {
		var index = start;
		start += 1;
		return index;
	}
};

function to(gen,end) {
	return function() {
	 var result = gen();
	 return result < end ? result :undefined;
	}
}

function fromTo(start,end) {
	return to(from(start),end);
}

function element(array, gen) {
	gen = (gen === undefined) ? fromTo(0,array.length) : gen;
	return function () {
		var index = gen();
		if (index !== undefined) {
			return array[index];
		}
	};
}

function collect(gen,array) {
	return function () {
		var index = gen();
		if (index !== undefined) {
			array.push(index);
		}
		return index;
	}
};

function filter(gen,pred) {
	return function () {
		var index;
		do {
			index = gen();
		} while(
			!pred(index) && index !== undefined
		);
		return index;
	}
};

function concat(gen1,gen2) {
	return function () {
		var index = gen1()
		if(index === undefined) {
			index = gen2();
		}
		return index;
	}
}

function gensymf(sym) {
	var start = 0; 
	return function() {
		start = inc(start);
		return sym + '' + start;
	};
};

function fibonaccif(first, second) {
	return function() {
      var next = first;
      first = second;
      second += next;
      return next;
    }
};

function counter(start) {
	return {
		up: function () { return start += 1},
		down: function () { return start -= 1}
	}
};

function revocable(func) {
	return {
		invoke : function(x,y) { 
			if(func !== undefined) {
			 	return func(x,y);
			}
		},
		revoke : function () { func = undefined;}
	}
};

function m(value, source) {
	return {
		value: value,
		source: (typeof source === 'string') 
			? source
			: String(value)
	};
};

function addm(a, b) {
	return m(
		a.value+b.value,
		"(" + a.source + "+" +
			b.source + ")"
	);
};

function liftm(func, str) {
	return function (a,b) {
		if (typeof a === 'number') {
			a = m(a);
		}
		if (typeof b === 'number') {
			b = m(b);
		}
		return m(
		func(a.value,b.value),
		"(" + a.source + str 
			+ b.source + ")"
		);
	};
};

function exp(array) {
	if( Array.isArray(array)) {
		return array[0](exp(array[1]),exp(array[2]));
	} else {
		return array;
	}
};

function addg(x) {
	if(x === undefined) {
		return undefined;
	}
	return function(y) {
		if(y === undefined) {
			return x;
		}
		return addg(x+y);
	};
};

function addg(x,array) {
	if(x === undefined && array === undefined) {
		return undefined;
	}
	if(x === undefined) {
		return array.reduce(function(prevVal, currVal, currIdx, array) {
				return prevVal + currVal;
		})
	} else {
		if(!Array.isArray(array)){
			array = [];
		}
		array.push(x);
		return curry(reverse(addg),array);
	}
	/*
	return function pushVal(y) { 
		if(y === undefined) {
			vals.map(function(val){sum += val;});
			return sum;
		} else {
			vals.push(y);
		}
		return pushVal;
	};*/

};

function liftg(func) {
	return function (first) {
		if(first === undefined) {
			return first;
		}
		return function more(next) {
			if (next === undefined) {
				return first;
			}
			first = func(first,next);
			return more;
		};
	};
};

function arrayg(x,array) {
	if(x === undefined && array === undefined) {
		return [];
	}
	if(x === undefined) {
		return array;
	} else {
		if(!Array.isArray(array)){
			array = [];
		}
		array[array.length] = x;
		return curry(reverse(arrayg),array);
	}
};

function continuize (func) {
	return function(callback,arg) {
		return callback(func(arg));
	};
};

function vector() {
	var array = [];
	return {
		get: function get(i) {
			return array[i];
			//return array[+i];
		},
		store: function store(i,v) {
			array[i] = v;
			//array[+i] = v;
		},
		append: function append(v) {
			array.push(v);
			//array[array.length] = v;
		}
	};
};

function pubsub() {
		var subscribers = [];
		return Object.freeze({
			subscribe: function (subscriber) {
				subscribers.push(subscriber);
			},
			publish: function (publication) {
				/*
				subscribers.forEach(function(s) {
					try {
						s(publication);
					} catch (ignore) {}
				});
				*/
				var i, length = subscriber.length;
				for (i = 0; i < length; i += 1) {
					try {
						subscribers[i](publication);
					} catch (ignore) {}
				}
			}
		});
}

module.exports = {
	add:add,
	sub:sub,
	mul:mul,
	identityf:identityf,
	addf:addf,
	liftf:liftf,
	curry:curry,
	twice:twice,
	reverse:reverse,
	doubl:doubl,
	square:square,
	composeu:composeu,
	composeb:composeb,
	inc:inc,
	limit:limit,
	from:from,
	to:to,
	fromTo:fromTo,
	element:element,
	collect:collect,
	filter:filter,
	concat:concat,
	gensymf:gensymf,
	fibonaccif:fibonaccif,
	counter:counter,
	revocable:revocable,
	m:m,
	addm:addm,
	liftm:liftm,
	exp:exp,
	addg:addg,
	liftg:liftg,
	arrayg:arrayg,
	continuize:continuize,
	vector:vector
};