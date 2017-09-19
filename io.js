'use strict';

const fse = require('fs-extra');

exports.open = function(name, mode) {
	return fse.open(name, mode);
};

exports.close = function(fd) {
	return fse.close(fd);
};

exports.read = async function(fd, buf, off, len) {
	return (await fse.read(fd, buf, off, len)).bytesRead;
};

exports.write = async function(fd, buf, off, len) {
	return (await fse.write(fd, buf, off, len)).bytesWritten;
};
