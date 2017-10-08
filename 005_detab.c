#!/usr/local/bin/node

// detab - convert tabs to spaces

"use strict";

const unixio = require("unixio");

async function main() {
	let col = 0;

	let c;
	while ((c = await unixio.stdin.getc()) != unixio.EOF) {
		if (c == 9) {
			do {
				await unixio.stdout.putc(32);
				col++;
			} while (col % 8 != 0);
		} else if (c == 10) {
			await unixio.stdout.putc(c);
			col = 0;
		} else {
			await unixio.stdout.putc(c);
			col++;
		}
	}
}

unixio.call(main);
