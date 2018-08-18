#!/usr/local/bin/node

// lzss - compression

"use strict";

const unixio = require("unixio");

const DICTSIZE = 256;

async function main() {
	let b;

	// Dictionary is initially empty

	let dictionary = [];
	dictionary.length = DICTSIZE;
	let dict_where = 0;

	while ((b = await unixio.stdin.getb()) != unixio.EOF) {
		let i;

		for (i = 0; i < 8; i++) {
			if (((b >> i) & 1) == 0) {
				let b1 = await unixio.stdin.getb();
				if (b1 != unixio.EOF) {
					await unixio.stdout.putb(b1);
					dictionary[dict_where] = b1;
					dict_where = (dict_where + 1) % DICTSIZE;
				}
			} else {
				let len = await unixio.stdin.getb();
				let where = await unixio.stdin.getb();

				if (len != unixio.EOF) {
					let newtext = [];

					let j;
					for (j = 0; j < len; j++) {
						await unixio.stdout.putb(dictionary[where + j % DICTSIZE]);
						newtext.push(dictionary[where + j % DICTSIZE]);
					}

					for (j = 0; j < len; j++) {
						dictionary[(dict_where + j) % DICTSIZE] = newtext[j];
						dict_where = (dict_where + 1) % DICTSIZE;
					}
				}
			}
		}
	}
}

unixio.call(main);
