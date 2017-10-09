#!/usr/local/bin/node

// entab - convert runs of spaces to tabs

"use strict";

const unixio = require("unixio");

const NL = "\n".codePointAt(0);
const SPC = " ".codePointAt(0);
const TAB = "\t".codePointAt(0);

async function main() {
	let col = 0;

	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		if (u == SPC) {
			let start = col;
			col++;

			if (col % 8 == 0) {
				await unixio.stdout.putu(SPC);
				start = col;
			}

			while ((u = await unixio.stdin.getu()) != unixio.EOF) {
				if (u == SPC) {
					col++;

					if (col % 8 == 0) {
						if (col - start > 2) {
							await unixio.stdout.putu(TAB);
						} else {
							let i;
							for (i = start; i < col; i++) {
								await unixio.stdout.putu(SPC);
							}
						}

						start = col;
					}
				} else {
					await unixio.stdin.ungetu(u);
					break;
				}
			}

			let i;
			for (i = start; i < col; i++) {
				await unixio.stdout.putu(SPC);
			}
		} else if (u == TAB) {
			await unixio.stdout.putu(u);
			col++;

			while (col % 8 != 0) {
				col++;
			}
		} else if (u == NL) {
			await unixio.stdout.putu(u);
			col = 0;
		} else {
			await unixio.stdout.putu(u);
			col++;
		}
	}
}

unixio.call(main);
