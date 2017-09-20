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
	this.file = fd;
	this.buffer = Buffer.alloc(512);
	this.head = 0;
	this.tail = 0;
	this.eof = false;

	this.flsbuf = async function(c) {
		if (this.tail > this.head) {
			await exports.write(this.file, this.buffer, this.head, this.tail - this.head);
		}

		this.head = 0;
		this.tail = 0;

		this.buffer[this.tail++] = c;
		return c;
	};

	this.filbuf = async function() {
		if (this.eof) {
			return exports.EOF;
		}

		this.head = 0;
		this.tail = await exports.read(this.file, this.buffer, this.head, this.buffer.length);
		if (this.tail <= 0) {
			this.eof = true;
			return exports.EOF;
		}

		return this.buffer[this.head++];
	};

	this.putc = async function(c) {
		if (this.tail < this.buffer.length) {
			this.buffer[this.tail++] = c;
			return c;
		} else {
			return await this.flsbuf(c);
		}
	};

	this.getc = async function() {
		let c;
		if (this.tail > this.head) {
			c = this.buffer[this.head++];
		} else {
			c = await this.filbuf();
		}
		return c;
	}

	this.fflush = async function() {
		return await this.flsbuf();
	}

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
