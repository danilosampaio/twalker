# twalker [![Build Status](https://travis-ci.org/danilosampaio/twalker.svg?branch=master)](https://travis-ci.org/danilosampaio/twalker)

> List files grouped by type, asynchronously.
> twalker is based in [walk](https://github.com/coolaj86/node-walk), a nodejs walk implementation.


## Install

```
$ npm install --save twalker
```


## Usage

```js
var twalker = require('twalker');
var walk = twalker('/home/me', {
  Images: ['jpg', 'png', 'gif', 'icon'],
  Documents: ['doc', 'docx', 'txt', 'pdf', 'xls', 'xlsx']
});

walk.on('file', function (fileStats) {
  //do something: calculate disk usage, list file names by type, etc.
  //fileStats.metaType: 'Images', 'Documents'
});

walk.on('end', function () {
  console.log('Done.')
})
```
If the `types` parameter is null, it uses a [default type definition](file-types.json)


## API

### twalker(baseDir, types)

#### baseDir

*Required*  
Type: `string`

The base directory where it walks from.

##### types

*Optional*  
Type: `JSON`  

List of files extensions grouped by type.


## License

MIT © [Danilo Sampaio](http://github.org/danilosampaio)
