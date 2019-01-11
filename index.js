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

	/**/
	like.json = function(schema, options) {
		options = options || {};

		function value(t, k) {
			if(typeof t === 'string' || t instanceof String) return '"\' + ' + k + (options.encode ? '.replace(/(\\\\|")/g, "\\\\$1")' : '') + ' + \'"';
			if(typeof t === 'number' || t instanceof Number) return '\' + ' + (options.finite ? ('(isFinite(' + k + ') ? ' + k + ' : null)') : k) + ' + \'';
			if(typeof t === 'boolean' || t instanceof Boolean) return '\' + ' + k + ' + \'';
			if(t === 'null') return 'null';
			if(typeof t === 'symbol') return '""';
			return undefined;
		}

		function recursive(base, parent) {
			let r = Array.isArray(base) ? '[' : '{'; 

			for(let k in base) {
				if(Array.isArray(base)) {
					k = parseInt(k, 10);
				}

				let key = !Array.isArray(base) ? '"' + k + '":' : '';

				if(base[k] === null) {
					r += key + 'null,';
				}
				else if(['function', 'symbol', 'undefined'].indexOf(typeof base[k]) !== -1) {
					if(Array.isArray(base) && isFinite(k)) {
						r += key + 'null,';
					}
				}
				else if(base[k] && typeof base[k].toJSON === 'function') {
					r += key + "\"' + " + 'o' + parent + (isFinite(k) ? '[' + k + ']' : '.' + k) + ".toJSON() + '\"" + ',';
				}
				else if(typeof base[k] === 'object' && [String, Number, Boolean].indexOf(base[k].constructor) === -1) {
					r += key + recursive(base[k], (isFinite(k) ? [parent + '[' + k + ']'] : [parent, k]).join('.')) + ',';
				}
				else {
					let v = value(base[k], 'o' + parent + (isFinite(k) ? '[' + k + ']' : '.' + k));

					if(v !== undefined) {
						r += key + v + ',';
					}
				}
			}

			if(r[r.length - 1] === ',') {
				r = r.slice(0, -1);
			}

			return r + (Array.isArray(base) ? ']' : '}');
		}

		if(schema === null) {
			return Function('o', "return 'null';");
		}

		if(['function', 'symbol', 'undefined'].indexOf(typeof schema) !== -1) {
			return Function('o', 'return undefined;');
		}

		if(schema && typeof schema.toJSON === 'function') {
			return Function('o', "return '\"' + o.toJSON() + '\"';");
		}

		if(typeof schema === 'object' && [String, Number, Boolean].indexOf(schema.constructor) === -1) {
			return Function('o', "return '" + recursive(schema, '') + "';");
		}

		return Function('o', "return '" + value(schema, 'o') + "';");
	}

	/**/
	like.stringify = function(obj, id, options) {
		if(!this._json_cache[id]) {
			this._json_cache[id] = this.json(obj, options);
		}

		return this._json_cache[id](obj);
	}

	/**/
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
