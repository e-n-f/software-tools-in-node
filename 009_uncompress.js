#!/usr/local/bin/node

// uncompress - undo run-length encoding

"use strict";

const unixio = require("unixio");

const PREFIX = 160;

async function read_varint(n) {
	let count = 0;
	let shift = 0;

	while (true) {
		let b = await unixio.stdin.getb();

		count |= (b & 0x7f) << shift;
		shift += 7;

		if ((b & 0x80) == 0) {
			break;
		}
	}

	return count;
}

async function main() {
	let b;
	while ((b = await unixio.stdin.getb()) != unixio.EOF) {
		if (b == PREFIX) {
			let count = await read_varint();
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
