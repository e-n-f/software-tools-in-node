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
	this.head = 0;
	this.tail = 0;
	this.file = fd;
	this.eof = 0;

	this.flsbuf = async function(c) {
		let rn = this.tail - this.head;
		let n = rn;

		if (n > 0) {
			n = await exports.write(this.file, this.buffer, this.head, n);
			this.head = this.tail = 0;
		}

		this.tail = this.buffer.length;
		this.buffer[this.head++] = c;

		if (n != rn) {
			throw new Exception();
		}

		return c;
	};

	this.filbuf = async function() {
		if (this.eof) {
			return exports.EOF;
		}

		this.head = 0;
		this.tail = await exports.read(this.file, this.buffer, this.head, this.buffer.length);
		if (this.tail <= 0) {
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

	this.fread = async function(buf, off, len) {
		let n = 0;

		for (let i = off; i < off + len; i++) {
			if ((buf[i] = await this.getc()) >= 0) {
				n++;
			} else {
				break;
			}
		}

		return n;
	};

	this.fwrite = async function(buf, off, len) {
		let n = 0;

		for (let i = off; i < off + len; i++) {
			if (await this.putc(buf[i]) >= 0) {
				n++;
			}
		}

		return n;
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
