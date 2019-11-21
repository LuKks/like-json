const Benchmark = require('benchmark');
const like = require('./index.js');

const suite = new Benchmark.Suite();

let data = {
  msg: 'Your link was created.',
  ok: true,
  data: { link: ['3b673d', 4882794] }
};

let stringify = like.json(data);

suite
  .add('JSON.stringify', function() {
    JSON.stringify(data);
  })
  .add('like.stringify', function() {
    like.stringify(data, 123);
  })
  .add('like.json', function() {
    stringify(data);
  })
  .add('concatenation', function() {
    '{"msg":"' +
      data.msg +
      '","ok":' +
      data.ok +
      ',"data":{"link":["' +
      data.data.link[0] +
      '",' +
      data.data.link[1] +
      "]}}";
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: false });
