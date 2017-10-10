#!/usr/local/bin/node

// compress - run-length encoding

"use strict";

const unixio = require("unixio");

const THRESH = 5;
const PREFIX = 160;

async function main() {
	let b;
	while ((b = await unixio.stdin.getb()) != unixio.EOF) {
		let count = 1;

		while (b == (await unixio.stdin.peekb())) {
			await unixio.stdin.getb();
			count++;
		}

		if (count >= THRESH || b == PREFIX) {
			await unixio.stdout.putb(PREFIX);
			await unixio.stdout.putu(count);
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
