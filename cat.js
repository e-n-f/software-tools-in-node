'use strict';

const io = require('./io.js');

async function cat(fp) {
	let c;
	while ((c = await fp.getc()) != io.EOF) {
		await io.stdout.putc(c);
	}
}

async function main() {
	if (process.argv.length <= 2) {
		await cat(io.stdin);
	} else {
		for (let i = 2; i < process.argv.length; i++) {
			let fp = await io.fopen(process.argv[i], 'r');
			await cat(fp);
			await fp.fclose();
		}
	}
}

main();
