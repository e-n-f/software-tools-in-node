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

exports.FILE = function(fd) {
	this.buffer = Buffer.alloc(512);
	this.base = 0;
	this.ptr = 0;
	this.cnt = this.buffer.length;
	this.file = fd;

	this.flsbuf = async function(c) {
		let rn = this.ptr - this.base;
		let n = rn;

		if (n > 0) {
			n = await exports.write(this.file, this.buffer, this.base, n);
			this.ptr = this.base;
		}

		this.cnt = this.buffer.length - 1;
		this.buffer[this.base++] = c;
		this.ptr = base;

		if (n != rn) {
			throw new Exception();
		}

		return c;
	};

	this.filbuf = async function() {
		this.ptr = this.base;
		this.cnt = await exports.read(this.file, this.buffer, this.ptr, this.buffer.length);
		if (this.cnt < 0) {
			this.cnt = 0;
			return exports.EOF;
		}

		return this.buffer[this.ptr++];
	};

	this.putc = async function(c) {
		if (this.cnt-- >= 0) {
			this.buffer[this.ptr++] = c;
			return c;
		} else {
			return await this.flsbuf(c);
		}
	};

	this.getc = async function() {
		if (this.cnt-- >= 0) {
			return this.buffer[this.ptr++];
		} else {
			return await this.filbuf();
		}
	}

	this.fread = async function(buf, off, len) {
		for (let i = off; i < off + len; i++) {
			buf[i] = await this.getc();
		}
	};

	this.fwrite = async function(buf, off, len) {
		for (let i = off; i < off + len; i++) {
			await this.putc(buf[i]);
		}
	};

	this.fclose = async function() {
		return await exports.close(fd);
	};
};

exports.stdin = new exports.FILE(0);
exports.stdout = new exports.FILE(1);
exports.stderr = new exports.FILE(2);
exports.EOF = -1;

exports.fopen = async function(name, mode) {
	var fd = await exports.open(name, mode);
	return new exports.FILE(fd);
}
