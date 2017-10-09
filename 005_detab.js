#!/usr/local/bin/node

// detab - convert tabs to spaces

"use strict";

const unixio = require("unixio");

const NL = "\n".codePointAt(0);
const SPC = " ".codePointAt(0);
const TAB = "\t".codePointAt(0);

async function main() {
	let col = 0;

	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		if (u == TAB) {
			do {
				await unixio.stdout.putu(SPC);
				col++;
			} while (col % 8 != 0);
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
