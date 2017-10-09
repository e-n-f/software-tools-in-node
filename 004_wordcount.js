#!/usr/local/bin/node

// wordcount - count words in standard input

"use strict";

const unixio = require("unixio");

const NL = "\n".codePointAt(0);
const SPC = " ".codePointAt(0);
const TAB = "\t".codePointAt(0);

async function main() {
	let wc = 0;
	let inword = false;

	let u;
	while ((u = await unixio.stdin.getu()) != unixio.EOF) {
		if (u == SPC || u == NL || u == TAB) {
			inword = false;
		} else if (!inword) {
			inword = true;
			wc++;
		}
	}

	await unixio.stdout.puts(wc + "\n");
}

unixio.call(main);
