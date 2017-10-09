#!/usr/local/bin/node

// entab - convert runs of spaces to tabs

"use strict";

const unixio = require("unixio");

async function main() {
	let col = 0;

	let c;
	while ((c = await unixio.stdin.getc()) != unixio.EOF) {
		if (c == 32) {
			let start = col;
			col++;

			if (col % 8 == 0) {
				await unixio.stdout.putc(32);
				start = col;
			}

			while ((c = await unixio.stdin.getc()) != unixio.EOF) {
				if (c == 32) {
					col++;

					if (col % 8 == 0) {
						if (col - start > 2) {
							await unixio.stdout.putc(9);
						} else {
							let i;
							for (i = start; i < col; i++) {
								await unixio.stdout.putc(32);
							}
						}

						start = col;
					}
				} else {
					await unixio.stdin.ungetc(c);
					break;
				}
			}

			let i;
			for (i = start; i < col; i++) {
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
