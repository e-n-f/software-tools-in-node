#!/usr/local/bin/node

// overstrike - convert backspaces into cr + spaces
//
// This really doesn't work in the contemporary world.
// Probably should be something about converting combining
// accents to Unicode canonical form instead?

"use strict";

const unixio = require("unixio");

async function main() {
	let col = 0;

	let c;
	while ((c = await unixio.stdin.getc()) != unixio.EOF) {
		if (c == 8) {
			col--;

			while ((c = await unixio.stdin.getc()) != unixio.EOF) {
				if (c == 8) {
					col--;
				} else {
					await unixio.stdin.ungetc(c);
					break;
				}
			}

			await unixio.stdout.putc(13);
			let i;
			for (i = 0; i < col; i++) {
				await unixio.stdout.putc(32);
			}
		} else if (c == 9) {
			await unixio.stdout.putc(c);
			col++;

			while (col % 8 != 0) {
				col++;
			}
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
