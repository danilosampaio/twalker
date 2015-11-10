'use strict';
var assert = require('assert');
var path = require('path');
var twalker = require('../');

describe('twalker', function () {
	it('Should calculate disk usage by default types', function (done) {
		var fixtures = path.join(__dirname, 'fixtures');
		var walker = twalker(fixtures);
		var usage = {};
		walker.on('file', function (root, fileStats) {
			if (!usage[fileStats.metaType]) {
				usage[fileStats.metaType] = 0;
			}

			usage[fileStats.metaType] += fileStats.size;
		});

		var expected = {
			'Archive and compressed': 14160,
			'Computer-aided Design': 7080,
			'Database': 7080,
			'Document': 14160,
			'Desktop publishing': 7080,
			'Sound and music': 14160,
			'Images': 28320,
			'Presentation': 7080,
			'Script': 21240,
			'Source code for computer programs': 7080,
			'Video': 14160
		};

		walker.on('end', function () {
			assert.deepEqual(usage, expected);
			done();
		});
	});

	it('Should calculate disk usage by custom types', function (done) {
		var fixtures = path.join(__dirname, 'fixtures');
		var walker = twalker(fixtures, {
			Images: ['jpg', 'png', 'gif', 'icon'],
			Documents: ['doc', 'docx', 'txt', 'pdf', 'xls', 'xlsx']
		});
		var usage = {};
		walker.on('file', function (root, fileStats) {
			if (!usage[fileStats.metaType]) {
				usage[fileStats.metaType] = 0;
			}

			usage[fileStats.metaType] += fileStats.size;
		});

		var expected = {Others: 99120, Documents: 21240, Images: 21240};

		walker.on('end', function () {
			assert.deepEqual(usage, expected);
			done();
		});
	});

	it('Should list files by default types', function (done) {
		var fixtures = path.join(__dirname, 'fixtures');
		var walker = twalker(fixtures);
		var files = {};
		walker.on('file', function (root, fileStats) {
			if (!files[fileStats.metaType]) {
				files[fileStats.metaType] = [];
			}

			files[fileStats.metaType].push(fileStats.name);
		});

		var expected = {
			'Archive and compressed': ['arc.tar', 'arc.zip'],
			'Computer-aided Design': ['cad.cad'],
			'Database': ['db.ora'],
			'Document': ['doc.doc', 'doc.txt'],
			'Desktop publishing': ['doc.pdf'],
			'Sound and music': ['music.mp3', 'music.wma'],
			'Images': ['pic.gif', 'pic.jpeg', 'pic.jpg', 'pic.png'],
			'Presentation': ['presentation.ppt'],
			'Script': ['script.js', 'script.sh', 'source.py'],
			'Source code for computer programs': ['source.ada'],
			'Video': ['video.mkv', 'video.mp4']
		};

		walker.on('end', function () {
			assert.deepEqual(files, expected);
			done();
		});
	});

	it('Should list files by custom types', function (done) {
		var fixtures = path.join(__dirname, 'fixtures');
		var walker = twalker(fixtures, {
			Images: ['jpg', 'png', 'gif', 'icon'],
			Documents: ['doc', 'docx', 'txt', 'pdf', 'xls', 'xlsx']
		});
		var files = {};
		walker.on('file', function (root, fileStats) {
			if (!files[fileStats.metaType]) {
				files[fileStats.metaType] = [];
			}

			files[fileStats.metaType].push(fileStats.name);
		});

		var expected = {
			Others: ['arc.tar', 'arc.zip', 'cad.cad', 'db.ora', 'music.mp3',
				'music.wma', 'pic.jpeg', 'presentation.ppt', 'script.js', 'script.sh',
				'source.ada', 'source.py', 'video.mkv', 'video.mp4'],
			Documents: ['doc.doc', 'doc.pdf', 'doc.txt'],
			Images: ['pic.gif', 'pic.jpg', 'pic.png']
		};

		walker.on('end', function () {
			assert.deepEqual(files, expected);
			done();
		});
	});
});
