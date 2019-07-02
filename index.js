/*
 like-json (https://npmjs.com/package/like-json)
 Copyright 2019 Lucas Barrena
 Licensed under MIT (https://github.com/LuKks/like-json)
*/

(function() {
	'use strict';

	let like = {
		_json_cache: {}
	};

	//
	like.json = function(schema, options) {
		options = options || {};

		function value(v, k) {
			//the next double checks seems equal but are different
			//for example, a = 'Some letters' and b = new String('Some letters')
			//a: the typeof is string and the instanceof is not String
			//b: the typeof is object and the instanceof is String
			//both are normal strings in JSON
			if(typeof v === 'string' || v instanceof String) {
				return '"\' + ' + k + (options.encode ? '.replace(/(\\\\|")/g, "\\\\$1")' : '') + ' + \'"';
			}

			//the previous explanation about strings apply in the same way for numbers and booleans
			if(typeof v === 'number' || v instanceof Number) {
				return '\' + ' + (options.finite ? ('(isFinite(' + k + ') ? ' + k + ' : null)') : k) + ' + \'';
			}

			if(typeof v === 'boolean' || v instanceof Boolean) {
				return '\' + ' + k + ' + \'';
			}

			return undefined;
		}

		function iterate_object_props(base, parent) {
			//used multiple times so saved here
			let isArray = Array.isArray(base);
			
			//start the struct
			let struct = isArray ? '[' : '{'; 

			//iterate the properties
			for(let k in base) {
				//we are using for in because "base" var can be object or array
				//then k var is string even if it is iterating an array
				if(isArray) {
					k = parseInt(k, 10);
				}

				//for example, you have arr = ['a', 'b']
				//you can: arr.c = true;
				//even being an array you will have a prop that is not numeric
				//in that case, k var here will be NaN due the previous parseInt
				let isNumeric = isFinite(k);

				//the actual path to be combined with previous parents if it's the case
				let actual = isNumeric ? '[' + k + ']' : '.' + k;

				//key var is for the struct and only needed when it's an object
				//for example, { message: 'ok' }, the prop "message" is the key
				//another example, ['ok', 'ok', 'deny'], here there is no key to add
				let key = isArray ? '' : '"' + k + '":';

				//the magic occurs here, checking values and types, in this way
				//we are adding these props to the struct being compatible with JSON
				if(base[k] === null) {
					//for example, if we are iterating [null, null]
					//then the struct var started with '['
					//key var is empty because it's an array
					//so, here the add will be just 'null,'
					struct += key + 'null,';
					//struct var here will be '[null,'
					//this explanation apply for every next checks/values
					//now you can jump to the return part (after loop) and see how it ends
				}
				else if(['function', 'symbol', 'undefined'].indexOf(typeof base[k]) !== -1) {
					if(isArray && isNumeric) {
						struct += key + 'null,';
					}
				}
				else if(base[k] && typeof base[k].toJSON === 'function') {
					struct += key + "\"' + " + 'o' + parent + actual + ".toJSON() + '\"" + ',';
				}
				else if(typeof base[k] === 'object' && [String, Number, Boolean].indexOf(base[k].constructor) === -1) {
					//just to be clear, for example, you have to stringify: { data: { visits: 9, purchases: 1 } }
					//in the first moment "base" var is the entire object
					//and, for example, base[k] is base.data object
					//so here recursively we iterate this new "base" object that is base.data
					//but we add the parent keys, in this way we don't lose the props of the real base object
					struct += key + iterate_object_props(base[k], parent + actual) + ',';
				}
				else {
					//here the type it's an string, number, etc
					let v = value(base[k], 'o' + parent + actual);

					if(v !== undefined) {
						struct += key + v + ',';
					}
				}
			}

			//we always added a comma for the next values
			//but at the end we have an extra comma that is useless
			//and not always there is props to iterate so need to check if really there is a comma to remove
			if(struct[struct.length - 1] === ',') {
				struct = struct.slice(0, -1);
			}

			//this is like the start but in this case we close the object or array
			return struct + (isArray ? ']' : '}');
		}

		//these checks are similar to the ones that are inside in the recursive function
		//but only for single values, that is, the schema is not object or array (no need to iterate)
		//also it's more simple doing the checks in this way instead of add more complexity in the function
		if(schema === null) {
			return Function('o', "return 'null';");
		}

		if(['function', 'symbol', 'undefined'].indexOf(typeof schema) !== -1) {
			return Function('o', 'return undefined;');
		}

		if(schema && typeof schema.toJSON === 'function') {
			return Function('o', "return '\"' + o.toJSON() + '\"';");
		}

		//you can create an object with null prototype, so this check allow that case
		if(typeof schema === 'object' && [String, Number, Boolean].indexOf(schema.constructor) === -1) {
			return Function('o', "return '" + iterate_object_props(schema, '') + "';");
		}

		return Function('o', "return '" + value(schema, 'o') + "';");
	}

	//
	like.stringify = function(obj, id, options) {
		if(!this._json_cache[id]) {
			this._json_cache[id] = this.json(obj, options);
		}

		return this._json_cache[id](obj);
	}

	//
	if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = like;
	}
	else if(typeof window !== 'undefined') {
		window.like = like;
	}
	else {
		console.log('Unable to export.');
	}
})();
