# like-json

Stringify at perfect performance. +1200%

![](https://img.shields.io/npm/v/like-json.svg) [![](https://img.shields.io/maintenance/yes/2019.svg?style=flat-square)](https://github.com/LuKks/like-json) [![](https://img.shields.io/bundlephobia/min/like-json.svg)](https://github.com/LuKks/like-json/blob/master/index.min.js) ![](https://img.shields.io/npm/dt/like-json.svg) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/LuKks/like-json) ![](https://img.shields.io/github/license/LuKks/like-json.svg)

![](https://i.imgur.com/utx06e8.png)
Benchmark it yourself: https://jsperf.com/likejson

## Install
Node.js:
```
npm i like-json
```
Browser:
```html
<script src="https://unpkg.com/like-json/index.min.js"></script>
```

## Features
#### Methods
```javascript
like.json(obj: Object|Array|Any, options: Object): Function
like.stringify(obj: Object|Array|Any, uniqueId: Number, options: Object): String
```

## json
```javascript
const like = require('like-json');

let stringify = like.json({ msg: '' });

let string1 = JSON.stringify({ msg: 'account created' });
let string2 = stringify({ msg: 'account created' });

console.log(string1 === string2); // true
```

## stringify
```javascript
const like = require('like-json');

let string1 = JSON.stringify({ msg: 'account created' });
let string2 = like.stringify({ msg: 'account created' }, 1);

console.log(string1 === string2); // true
```

## How it works?
There is no processing, so same than a simple concatenation:
```javascript
console.log(stringify.toString());
// ->
function anonymous (o) {
  return '{"msg":"' + o.msg + '"}';
}
```

Because that there is a conflict with double quotes:\
```javascript
{ msg: 'account "user" created' } // object
{"msg":"account \"user\" created"} // JSON.stringify
{"msg":"account "user" created"} // like.stringify
```

You can use single quotes, in that way avoid escape which reduces performance.\
If really want to use double quotes then can use options:
```javascript
let options = { encode: true };
let string1 = JSON.stringify({ msg: 'account "user" created' });
let string2 = like.stringify({ msg: 'account "user" created' }, 1, options);
console.log(string1 === string2); // true
```

## Tests
```
npm test
```
Inside of stringify.test.js can see more info.

## License
Code released under the [MIT License](https://github.com/LuKks/like-json/blob/master/LICENSE).
