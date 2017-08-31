#!/usr/local/bin/node

// copy - copy input characters to output

'use strict';

process.stdin.on('data', (text) => {
	process.stdout.write(text);
});
