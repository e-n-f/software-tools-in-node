'use strict';

const fse = require('fs-extra');

exports.open = async function(name, mode) {
	return await fse.open(name, mode);
};

exports.close = async function(fd) {
	return await fse.close(fd);
};

exports.read = async function(fd, buf, off, len) {
	return (await fse.read(fd, buf, off, len)).bytesRead;
};

exports.write = async function(fd, buf, off, len) {
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
