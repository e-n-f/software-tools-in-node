#!/usr/local/bin/node

// crypt - obscure file contents

"use strict";

const unixio = require("unixio");

let key = null;

async function setkey(k) {
	key = k;
}

async function main() {
	await unixio.getopt({}, { "-k": setkey, "--key": setkey });

	if (key == null || key.length == 0) {
		await unixio.stderr.puts("Usage: " + process.argv[1] + "--key=whatever\n");
		process.exit(1);
	}

	let keybuf = Buffer.from(key);
	let off = 0;

	let b;
	while ((b = await unixio.stdin.getb()) != unixio.EOF) {
		b = b ^ keybuf[off];
		off = (off + 1) % keybuf.length;

		await unixio.stdout.putb(b);
	}
}

unixio.call(main);
