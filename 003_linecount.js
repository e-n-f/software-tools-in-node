#!/usr/local/bin/node

// linecount - count lines in standard input

'use strict';

let nl = 0;

process.stdin.on('data', (text) => {
	let s = text.toString('utf-8');
	for (let i = 0; i < s.length; i++) {
		if (s[i] == '\n') {
			nl++;
		}
	}
}).on('end', () => {
	process.stdout.write(Buffer(nl + '\n'));
});
