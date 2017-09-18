const fse = require('fs-extra');

async function main() {
	var b = Buffer.alloc(2000);

	var n;
	while ((n = await fse.read(0, b, 0, b.length)).bytesRead > 0) {
		await fse.write(1, b, 0, n.bytesRead);
	}
}

main();
