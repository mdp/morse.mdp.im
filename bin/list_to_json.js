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
    txt = txt.split("[")[0].trim()
    return txt.replace(/[^a-zA-Z0-9\s\<\>]+/, "").trim()
}

rl.on('line', (line) => {
    list.push(clean(line));
});

rl.on('close', (line) => {
    // output json
    let output = {};
    const uniqueList = list.filter((value, index, self) => self.indexOf(value) === index)
    output[args[1]] = uniqueList;
    process.stdout.write(JSON.stringify(output));
    process.exit(0);
});
