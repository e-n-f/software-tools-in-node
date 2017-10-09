#!/usr/local/bin/node

// overstrike - convert backspaces into cr + spaces
//
// This really doesn't work in the contemporary world.
// Probably should be something about converting combining
// accents to Unicode canonical form instead?

"use strict";

const unixio = require("unixio");

const NL = "\n".codePointAt(0);
const SPC = " ".codePointAt(0);
const TAB = "\t".codePointAt(0);
const BS = "\b".codePointAt(0);
const CR = "\r".codePointAt(0);

async function main() {
	let col = 0;

	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		if (u == BS) {
			col--;

			while ((u = await unixio.stdin.getu()) != unixio.EOF) {
				if (u == BS) {
					col--;
				} else {
					await unixio.stdin.ungetu(u);
					break;
				}
			}

			await unixio.stdout.putu(CR);
			let i;
			for (i = 0; i < col; i++) {
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
