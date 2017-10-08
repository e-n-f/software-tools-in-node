#!/usr/local/bin/node

// linecount - count lines in standard input

"use strict";

const unixio = require("unixio");

async function main() {
	let nl = 0;

	let c;
	while ((c = await unixio.stdin.getc()) != unixio.EOF) {
		if (c == 10) {
			nl++;
		}
	}

	await unixio.stdout.puts(nl + "\n");
}

unixio.call(main);
