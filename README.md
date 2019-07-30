# like-json

![](https://img.shields.io/npm/v/like-json.svg) [![](https://img.shields.io/maintenance/yes/2019.svg?style=flat-square)](https://github.com/LuKks/like-json) [![](https://img.shields.io/bundlephobia/min/like-json.svg)](https://github.com/LuKks/like-json/blob/master/index.min.js) ![](https://img.shields.io/npm/dt/like-json.svg) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/LuKks/like-json) ![](https://img.shields.io/github/license/LuKks/like-json.svg)

Stringify at perfect performance. +1200%

![](https://i.imgur.com/utx06e8.png)
Benchmark it yourself: https://jsperf.com/likejson

## Install
NodeJS:
```
npm i like-json
```
Browser:
```html
<script src="https://unpkg.com/like-json/index.min.js"></script>
```

## Examples
If you want to start using like-json:
```javascript
let like = require('like-json');

console.log(JSON.stringify({ msg: 'Created.' }));
//to ->
console.log(like.stringify({ msg: 'Created.' }, 1)); //where 1 is a unique id for this struct
```

Can get more performance if you avoid the internal check and function call in .stringify:
```javascript
let like = require('like-json');

//on somewhere
let stringify = like.json({ msg: '' });

//and use it
console.log(stringify({ msg: 'Created.' }));
```

## How it works?
Basically, almost there is no processing, so same than a simple concatenation
```javascript
//see the internal code with the previous example
console.log(stringify.toString());

/*
function anonymous(o) {
  return '{"msg":"' + o.msg + '"}';
}
*/
```

## Tests
```
npm test
```
Inside of stringify.test.js can see more info.

## License
Code released under the [MIT License](https://github.com/LuKks/like-json/blob/master/LICENSE).
