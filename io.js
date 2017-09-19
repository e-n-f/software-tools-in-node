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

module.exports.FILE = function(thefd) {
	this.fd = thefd,

	this.fread = async function(buf, off, len) {
		return await module.exports.read(this.fd, buf, off, len);
	};

	this.fwrite = async function(buf, off, len) {
		return await module.exports.write(this.fd, buf, off, len);
	};

	this.fclose = async function() {
		return await module.exports.close(this.fd);
	};
};

module.exports.stdin = new module.exports.FILE(0);
module.exports.stdout = new module.exports.FILE(1);
module.exports.stderr = new module.exports.FILE(2);

module.exports.fopen = async function(name, mode) {
	var fd = await module.exports.open(name, mode);
	return new module.exports.FILE(fd);
}
