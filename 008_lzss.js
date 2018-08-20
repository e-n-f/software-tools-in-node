#!/usr/local/bin/node

// lzss - compression

"use strict";

const unixio = require("unixio");

const BUFSIZE = 18;
const DICTSIZE = 4096;

async function flush(outsize, outtype, outbuf) {
	let i;
	let types = 0;
	for (i = 0; i < outsize; i++) {
		types |= (outtype[i] << i);
	}
	await unixio.stdout.putb(types);
	for (i = 0; i < outsize; i++) {
		if (outtype[i] == 1) {
			await unixio.stdout.putb(outbuf[i] >> 8);
			await unixio.stdout.putb(outbuf[i] & 0xFF);
		} else {
			await unixio.stdout.putb(outbuf[i]);
		}
	}
}

async function main() {
	let b;

	let outsize = 0;
	let outtype = [];
	outtype.length = 8;
	let outbuf = [];
	outbuf.length = 8;

	// Dictionary is initially empty

	let dictionary = [];
	dictionary.length = DICTSIZE;
	let dict_where = 0;

	// Fill lookahead

	let buf = [];
	while (buf.length < BUFSIZE && (b = await unixio.stdin.getb()) != unixio.EOF) {
		buf.push(b);
	}

	while (buf.length > 0) {
		let best = -1;
		let bestlen = -1;

		let i;
		for (i = 0; i < DICTSIZE; i++) {
			if (dictionary[i] === buf[0]) {
				let j;
				for (j = 1; j < BUFSIZE; j++) {
					if (dictionary[(i + j) % DICTSIZE] != buf[j]) {
						break;
					}
				}

				if (j > bestlen) {
					bestlen = j;
					best = i;
				}
			}
		}

		if (bestlen > 2) {
			outtype[outsize] = 1;
			outbuf[outsize] = best | ((bestlen - 3) << 12);
			outsize++;

			for (i = 0; i < bestlen; i++) {
				dictionary[dict_where] = buf[i];
				dict_where = (dict_where + 1) % DICTSIZE;
			}

			buf.splice(0, bestlen);
		} else {
			outtype[outsize] = 0;
			outbuf[outsize] = buf[0];
			outsize++;

			dictionary[dict_where] = buf[0];
			dict_where = (dict_where + 1) % DICTSIZE;

			buf.splice(0, 1);
		}

		if (outsize == 8) {
			await flush(outsize, outtype, outbuf);
			outsize = 0;
		}

		while (buf.length < BUFSIZE && (b = await unixio.stdin.getb()) != unixio.EOF) {
			buf.push(b);
		}
	}

	await flush(outsize, outtype, outbuf);
}

unixio.call(main);
