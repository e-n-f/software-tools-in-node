#!/usr/local/bin/node

// uncompress - undo run-length encoding

"use strict";

const unixio = require("unixio");

const PREFIX = 160;

async function main() {
	let b;
	while ((b = await unixio.stdin.getb()) != unixio.EOF) {
		if (b == PREFIX) {
			let count = await unixio.stdin.getu();
			b = await unixio.stdin.getb();

			let i;
			for (i = 0; i < count; i++) {
				await unixio.stdout.putb(b);
			}
		} else {
			await unixio.stdout.putb(b);
		}
	}
}

unixio.call(main);
