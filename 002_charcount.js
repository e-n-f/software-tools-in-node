// charcount - count characters in standard input

let nc = 0;

process.stdin.on('data', (text) => {
	let s = text.toString('utf-8');
	nc += s.length;
}).on('end', () => {
	process.stdout.write(Buffer(nc + '\n'));
});
