#!/usr/local/bin/node

// compress - run-length encoding

"use strict";

const unixio = require("unixio");

const THRESH = 5;
const PREFIX = 160;

async function write_varint(n) {
	while (n > 0x7f) {
		await unixio.stdout.putb((n & 0x7f) | 0x80);
		n >>= 7;
	}
	await unixio.stdout.putb(n);
}

// XXX should be in the library
async function peekb() {
	let b = await unixio.stdin.getb();
	await unixio.stdin.ungetb(b);
	return b;
}

async function main() {
	let b;
	while ((b = await unixio.stdin.getb()) != unixio.EOF) {
		let count = 1;

		while (b == (await peekb())) {
			await unixio.stdin.getb();
			count++;
		}

		if (count >= THRESH || b == PREFIX) {
			await unixio.stdout.putb(PREFIX);
			await write_varint(count);
			await unixio.stdout.putb(b);
		} else {
			let i;
			for (i = 0; i < count; i++) {
				await unixio.stdout.putb(b);
			}
		}
	}
}

unixio.call(main);
