const readline = require('readline');
const fs = require('fs');


const args = process.argv.slice(2);
const list = []

const rl = readline.createInterface({
    input: fs.createReadStream(args[0]),
    output: process.stdout,
    terminal: false
});

function clean(txt) {
    return txt.replace(/[^a-zA-Z0-9\<\>]+/, "")
}

rl.on('line', (line) => {
    list.push(clean(line));
});

rl.on('close', (line) => {
    // output json
    let output = {};
    output[args[1]] = list;
    process.stdout.write(JSON.stringify(output));
    process.exit(0);
});
