#!/usr/local/bin/node

// charcount - count characters in standard input

"use strict";

const unixio = require("unixio");

async function main() {
	let nc = 0;

	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		nc++;
	}

	await unixio.stdout.puts(nc + "\n");
}

unixio.call(main);
