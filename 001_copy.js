// copy - copy input characters to output

process.stdin.on('data', (text) => {
	process.stdout.write(text);
});
