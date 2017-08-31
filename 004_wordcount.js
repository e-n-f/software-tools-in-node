#!/usr/local/bin/node

// wordcount - count words in standard input

'use strict';

let wc = 0, inword = false;

process.stdin.on('data', (text) => {
	let s = text.toString('utf-8');
	for (let i = 0; i < s.length; i++) {
		let c = s[i];

		if (c == ' ' || c == '\n' || c == '\t') {
			inword = false;
		} else if (!inword) {
			inword = true;
			wc++;
		}
	}
}).on('end', () => {
	process.stdout.write(Buffer(wc + '\n'));
});
