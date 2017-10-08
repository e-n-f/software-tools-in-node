#!/usr/local/bin/node

// wordcount - count words in standard input

"use strict";

const unixio = require("unixio");

async function main() {
	let wc = 0;
	let inword = false;

	let c;
	while ((c = await unixio.stdin.getc()) != unixio.EOF) {
		if (c == 32 || c == 10 || c == 9) {
			inword = false;
		} else if (!inword) {
			inword = true;
			wc++;
		}
	}

	await unixio.stdout.puts(wc + "\n");
}

unixio.call(main);
