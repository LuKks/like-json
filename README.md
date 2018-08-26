# like-json

![](https://vgy.me/yB4PBK.gif)

## Comparison
```javascript
var like = require('like-json');

var data = { a: 'text', b: true, c: 0, d: { f: null } };

console.log(JSON.stringify(data));
console.log(like.stringify(1234, data));
console.log(like.json(data)(data));
console.log('{"a":"' + data.a + '","b":' + data.b + ',"c":' + data.c + ',"d":{"f":' + data.d.f + '}}');

//normal
stress('JSON.stringify', 5, () => {
  JSON.stringify(data);
});

//performance
stress('like.stringify', 5, () => {
  like.stringify(123, data);
});

//performance++
var stringify = like.json(data);

stress('like.json     ', 5, () => {
  stringify(data);
});

//simple concatenation
stress('concatenation ', 5, () => {
  '{"a":"' + data.a + '","b":' + data.b + ',"c":' + data.c + ',"d":{"f":null}}';
});

function stress(name, duration, fn) {
  for(let i = 1, total = 0, hr = []; i <= duration; i++) {
    hr = process.hrtime();
    while(process.hrtime(hr)[0] < 1 && ++total) fn();
    console.log(name, '->', (total / i).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '/s', i === duration ? 'END' : '');
  }
} //I had to reduce the function, sorry that readability
```

## How works?
Basically, almost there is no processing, so same than a simple concatenation
```javascript
console.log(stringify.toString()); //see the internal code with the previous example
```

## Tests
```javascript
var ex = [
  { a: 'text', b: true, c: 0, d: { f: null } },
  { name: 'Lucas', age: 20, dev: true, times:[1, 2, 3, 4, 5], data: [{ i: 123, id:'abc', time: 123123 }, { i: 321, id:'cba', time: 321321 }] },
  { times: [1, 2, 3, 4, 5] },
  [1, 2, 3, 4, 5, { a:[{ a:[ { a:[[[[[[[[[{ a:'b', c:'d' }]]]]]]]]] } ] }] }],
  { 0:{ 0:{ 0:{ 0:[1, 2, 3] } } } },
  'test',
  12345,
  true,
  null,
  undefined,
  function() {},
  //{ message: 'It\'s ok \1 ay', error: false }, //this
  //{ message: 'It\'s ok \4 ay', error: false }, //and this fails because I'm not sure how encode \1, \4, etc properly and optimized way
  { message: 'It\'s ok"ay', error: false },
  { message: 'It\'s ok"a"y', error: false },
  { message: 'It\'s ok"a\\y', error: false },
  { message: 'It\'s o\\"ka\"a"a\\y\\', error: false },
  { message: 'Iñtërnâtiônàlizætiøn', error: false },
  new Date(),
  Symbol,
  Symbol(),
  [{}, [], 1, true, null, undefined, function() {}, new Date(), Symbol, Symbol()],
  [{ a: new Date() }],
  { a: [new Date()] },
  [new Date()],
  //{ toJSON: function() { return '"asd"' } }, //this
  //{ toJSON: function() { return '{"a":"b"}' /*or {a:'b'}*/ } }, //and this fails because, for now, it's very simple the functionality of toJSON of like.json
  { toJSON: function() { return 'asd' } }, //but this works
];

//remember: "fails" means that no return the same json than JSON.stringify

for(let i in ex) {
  if(JSON.stringify(ex[i]) !== like.stringify(i, ex[i], { encode: true, finite: true })) {
    console.log(i, 'fails');
  }
}
```
