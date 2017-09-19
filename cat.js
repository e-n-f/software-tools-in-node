'use strict';

const io = require('./io.js');

async function cat(fp) {
	let b = Buffer.alloc(2000);

	let n;
	while ((n = await fp.fread(b, 0, b.length)) > 0) {
		let off = 0;
		while (off < n) {
			off += await io.stdout.fwrite(b, off, n - off);
		}
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
