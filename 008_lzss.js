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
	let candidates = {};

	// Fill lookahead

	let buf = [];
	while (buf.length < BUFSIZE && (b = await unixio.stdin.getb()) != unixio.EOF) {
		buf.push(b);
	}

	while (buf.length > 0) {
		let best = -1;
		let bestlen = 0;

		let key = String.fromCharCode(buf[0]) +
		          String.fromCharCode(buf[1]) +
		          String.fromCharCode(buf[2]);

		for (let i in candidates[key]) {
			i = Number(i);

			let j;
			for (j = 0; j < BUFSIZE; j++) {
				if (dictionary[(i + j) % DICTSIZE] != buf[j]) {
					break;
				}
			}

			if (j > bestlen) {
				bestlen = j;
				best = i;
			}

			if (bestlen == BUFSIZE) {
				break;
			}
		}

		if (bestlen > 2) {
			outtype[outsize] = 1;
			outbuf[outsize] = best | ((bestlen - 3) << 12);
			outsize++;
		} else {
			outtype[outsize] = 0;
			outbuf[outsize] = buf[0];
			outsize++;

			bestlen = 1;
		}

		for (let i = 0; i < bestlen; i++) {
			for (let j = 0; j < 3; j++) {
				let key1 = String.fromCharCode(dictionary[(dict_where + DICTSIZE - 2 + j) % DICTSIZE]) +
				           String.fromCharCode(dictionary[(dict_where + DICTSIZE - 1 + j) % DICTSIZE]) +
				           String.fromCharCode(dictionary[(dict_where + DICTSIZE - 0 + j) % DICTSIZE]);

				if (candidates[key1] === undefined) {
					candidates[key1] = {};
				}

				delete candidates[key1][(dict_where + DICTSIZE - 2) % DICTSIZE];
			}

			dictionary[dict_where] = buf[i];

			for (let j = 0; j < 3; j++) {
				let key1 = String.fromCharCode(dictionary[(dict_where + DICTSIZE - 2 + j) % DICTSIZE]) +
				           String.fromCharCode(dictionary[(dict_where + DICTSIZE - 1 + j) % DICTSIZE]) +
				           String.fromCharCode(dictionary[(dict_where + DICTSIZE - 0 + j) % DICTSIZE]);

				if (candidates[key1] === undefined) {
					candidates[key1] = {};
				}

				candidates[key1][(dict_where + DICTSIZE - 2) % DICTSIZE] = 1;
			}

			dict_where = (dict_where + 1) % DICTSIZE;
		}

		buf.splice(0, bestlen);

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
