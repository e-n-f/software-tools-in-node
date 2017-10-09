#!/usr/local/bin/node

// overstrike - convert backspaces into combining Unicode

"use strict";

const unixio = require("unixio");

const NL = "\n".codePointAt(0);
const SPC = " ".codePointAt(0);
const TAB = "\t".codePointAt(0);
const BS = "\b".codePointAt(0);
const CR = "\r".codePointAt(0);
const UL = "_".codePointAt(0);
const CAPA = "A".codePointAt(0);
const CAPZ = "Z".codePointAt(0);
const LCA = "a".codePointAt(0);
const LCZ = "z".codePointAt(0);

async function main() {
	let col = 0;

	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		let u2 = await unixio.stdin.peeku();

		if (u2 == BS) {
			u2 = await unixio.stdin.getu();
			u2 = await unixio.stdin.getu();

			// Look for underscore as either 1st or second character
			let ul = false;
			if (u2 == UL) {
				u2 = u;
				u = UL;
			}
			if (u == UL) {
				ul = true;

				// In case there is a bold character after the underscore
				let u3 = await unixio.stdin.peeku();
				if (u3 == BS) {
					u3 = await unixio.stdin.getu();
					u3 = await unixio.stdin.getu();

					u = u2;
					u2 = u3;
				}
			}

			// Mathematical bold if same character overstruck
			if (u == u2) {
				if (u >= CAPA && u <= CAPZ) {
					u2 = 0x1d5d4 + u - CAPA;
				} else if (u >= LCA && u <= LCZ) {
					u2 = 0x1d5ee + u - LCA;
				}
			}

			await unixio.stdout.putu(u2);
			if (ul) {
				await unixio.stdout.putu(0x0332);
			}
		} else {
			await unixio.stdout.putu(u);
		}
	}
}

unixio.call(main);
