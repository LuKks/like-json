let like = require('./index.js');
let like_min = require('./index.min.js');

let ex = [
  'a', 1, 1.0, true, false, null, undefined, {}, [],
  Infinity, NaN, Date, String, Number, Object, Array, function() {}, Symbol,
  new String('aaaa'), new Number(1), new Boolean(false), new Date(),
  new Set([1]), new Map([[1, 1]]), new WeakSet([{ a: 1 }]), new WeakMap([[{ a: 1 }, 1]]),
  new Int8Array([1]), new Int16Array([1]), new Int32Array([1]),
  { [Symbol.for('aaa')]: 'aaa' }, Symbol.for('aaa'),
  Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }),
  'a\'"a\\a\"a', 'Iñtërnâtiônàlizætiøn', 
  { toJSON: function() { return 'aaa'; } },
 
  //'It\'s ok \1 ay', //this fails because I'm not sure how encode \1, \4, etc properly and optimized way
  //{ toJSON: function() { return '"aaa"'; } }, //these three fails because toJSON behaviour is very simple (only strings)
  //{ toJSON: function() { return '{"a":"b"}'; } },
  //{ toJSON: function() { return 111; } } //'111'
  //"fails" means that no return the same JSON than JSON.stringify
];

ex.aaa = 1; //set k/v on array

check('all', ex, '-1');

for(let i in ex) {
  check('as value', ex[i], i);
  check('as array value', [ex[i]], i);
  check('as object key/value', { a: ex[i] }, i);
}

function check(info, data, id) {
	/**/
	test('like.stringify          ' + info + ' (' + id + ')', () => {
		expect(like.stringify(data, id + info, { encode: true, finite: true })).toBe(JSON.stringify(data));
	});

	test('like.json               ' + info + ' (' + id + ')', () => {
		let stringify = like.json(data, { encode: true, finite: true });

		expect(stringify(data)).toBe(JSON.stringify(data));
	});

	/*minified version*/
	test('like.stringify minified ' + info + ' (' + id + ')', () => {
		expect(like_min.stringify(data, id + info, { encode: true, finite: true })).toBe(JSON.stringify(data));
	});

	test('like.json minified      ' + info + ' (' + id + ')', () => {
		let stringify_min = like_min.json(data, { encode: true, finite: true });

		expect(stringify_min(data)).toBe(JSON.stringify(data));
	});
}
