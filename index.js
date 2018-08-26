/*
	(C) 2018 Lucas Barrena
	See LICENSE for licensing info
*/

'use strict';

var like = {};

var _schemaCache = {};

like.json = (schema, options) => { //do: .parse
	options = options || {};

	//should do it better based on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

	function value(t, k) {
		switch(typeof t) {
			case 'string': return options.encode ? ('"\' + ' + k + '.replace(/(\\\\|")/g, "\\\\$1") + \'"') : ('"\' + ' + k + ' + \'"');
			case 'number': return options.finite ? ('\' + (isFinite(' + k + ') ? ' + k + ' : null) + \'') : ('\' + ' + k + ' + \'');
			case 'boolean': return '\' + ' + k + ' + \'';
			case 'null': return 'null';
			case 'symbol': return '""';
			default: return undefined;
		}
	}

	function recursive(base, parent) {
		let r = Array.isArray(base) ? '[' : '{'; 

		for(let k in base) {
			if(Array.isArray(base)) {
				k = parseInt(k);
			}

			let key = !Array.isArray(base) ? '"' + k + '":' : '';

			if(base[k] === null || ['function', 'symbol', 'undefined'].indexOf(typeof base[k]) !== -1) {
				r += key + 'null' + ',';
			}
			else if(base[k] && typeof base[k].toJSON === 'function') {
				r += key + "\"' + " + 'obj' + parent + (isFinite(k) ? '[' + k + ']' : '.' + k) + ".toJSON() + '\"" + ',';
			}
			else if(typeof base[k] === 'object') {
				r += key + recursive(base[k], (isFinite(k) ? [parent + '[' + k + ']'] : [parent, k]).join('.')) + ',';
			}
			else {
				let v = value(base[k], 'obj' + parent + (isFinite(k) ? '[' + k + ']' : '.' + k));

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
		return Function('obj', "return 'null';");
	}

	if(['function', 'symbol', 'undefined'].indexOf(typeof schema) !== -1) {
		return Function('obj', 'return undefined;');
	}

	if(schema && typeof schema.toJSON === 'function') {
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
		return Function('obj', "return '\"' + obj.toJSON() + '\"';"); //very simple? should have more behavior 
	}

	return Function('obj', "return '" + (typeof schema === 'object' ? recursive(schema, '') : value(schema, 'obj')) + "';");
}

like.stringify = function(id, obj, options) {
	if(_schemaCache[id]) {
		return _schemaCache[id](obj);
	}
	
	_schemaCache[id] = like.json(obj, options);
	return like.stringify(id, obj);
}

module.exports = like;
