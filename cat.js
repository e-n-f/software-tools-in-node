'use strict';

const fse = require('fs-extra');

async function cat(fd) {
	var b = Buffer.alloc(2000);

	var n;
	while ((n = (await fse.read(fd, b, 0, b.length)).bytesRead) > 0) {
		await fse.write(1, b, 0, n);
	}
}

async function main() {
	if (process.argv.length <= 2) {
		await cat(0);
	} else {
		for (var i = 2; i < process.argv.length; i++) {
			var fd = await fse.open(process.argv[i], 'r');
			await cat(fd);
			await fse.close(fd);
		}
	}
}

main();
