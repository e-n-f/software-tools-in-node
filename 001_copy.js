#!/usr/local/bin/node

// copy - copy input characters to output

"use strict";

const unixio = require("unixio");

async function main() {
	let c;
	while ((c = await unixio.stdin.getc()) != unixio.EOF) {
		await unixio.stdout.putc(c);
	}
}

unixio.call(main);
