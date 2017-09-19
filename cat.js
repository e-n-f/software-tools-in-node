'use strict';

const io = require('./io.js');

async function cat(fd) {
	let b = Buffer.alloc(2000);

	let n;
	while ((n = await io.read(fd, b, 0, b.length)) > 0) {
		let off = 0;
		while (off < n) {
			off += await io.write(1, b, off, n - off);
		}
	}
}

async function main() {
	if (process.argv.length <= 2) {
		await cat(0);
	} else {
		for (let i = 2; i < process.argv.length; i++) {
			let fd = await io.open(process.argv[i], 'r');
			await cat(fd);
			await io.close(fd);
		}
	}
}

main();
