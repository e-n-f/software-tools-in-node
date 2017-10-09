#!/usr/local/bin/node

// linecount - count lines in standard input

"use strict";

const unixio = require("unixio");
const NL = "\n".codePointAt(0);

async function main() {
	let nl = 0;

	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		if (u == NL) {
			nl++;
		}
	}

	await unixio.stdout.puts(nl + "\n");
}

unixio.call(main);
