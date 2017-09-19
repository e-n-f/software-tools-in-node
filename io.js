'use strict';

const fse = require('fs-extra');

module.exports.open = function(name, mode) {
	return fse.open(name, mode);
};

module.exports.close = function(fd) {
	return fse.close(fd);
};

module.exports.read = async function(fd, buf, off, len) {
	return (await fse.read(fd, buf, off, len)).bytesRead;
};

module.exports.write = async function(fd, buf, off, len) {
	return (await fse.write(fd, buf, off, len)).bytesWritten;
};
