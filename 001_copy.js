#!/usr/local/bin/node

// copy - copy input characters to output

"use strict";

const unixio = require("unixio");

async function main() {
	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		await unixio.stdout.putu(u);
	}
}

unixio.call(main);
