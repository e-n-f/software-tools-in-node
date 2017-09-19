'use strict';

const io = require('./io.js');

async function cat(fd) {
	var b = Buffer.alloc(2000);

	var n;
	while ((n = await io.read(fd, b, 0, b.length)) > 0) {
		var off = 0;
		while (off < n) {
			off += await io.write(1, b, off, n - off);
		}
	}
}

async function main() {
	if (process.argv.length <= 2) {
		await cat(0);
	} else {
		for (var i = 2; i < process.argv.length; i++) {
			var fd = await io.open(process.argv[i], 'r');
			await cat(fd);
			await io.close(fd);
		}
	}
}

main();
