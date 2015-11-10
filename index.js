'use strict';
var walk = require('walk');
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = function (baseDir, types) {
	if (typeof baseDir !== 'string') {
		throw new TypeError('Expected a string');
	}

	types = types || JSON.parse(fs.readFileSync('./file-types.json', 'utf8'));

	var walker = walk.walk(baseDir, {
		followLinks: false
	});

	function TWalkerEmitter() {
		EventEmitter.call(this);
	}

	util.inherits(TWalkerEmitter, EventEmitter);

	TWalkerEmitter.prototype._file = function (root, fileStats, next) {
		this.emit('file', root, fileStats, next);
	};

	TWalkerEmitter.prototype._errors = function (root, nodeStatsArray, next) {
		this.emit('errors', root, nodeStatsArray, next);
	};

	TWalkerEmitter.prototype._end = function () {
		this.emit('end');
	};

	var twalker = new TWalkerEmitter();

	walker.on('file', function (root, fileStats, next) {
		for (var type in types) {
			if (types.hasOwnProperty(type)) {
				var extensions = types[type];
				var fileExtension = path.extname(fileStats.name).replace('.', '').toLowerCase();

				if (extensions.indexOf(fileExtension) !== -1) {
					fileStats.metaType = type;
					break;
				}
			}
		}

		if (!fileStats.metaType) {
			fileStats.metaType = 'Others';
		}

		twalker._file(root, fileStats, next);
		next();
	});

	walker.on('errors', function (root, nodeStatsArray, next) {
		twalker._errors(root, nodeStatsArray, next);
	});

	walker.on('end', function () {
		twalker._end();
	});

	return twalker;
};
