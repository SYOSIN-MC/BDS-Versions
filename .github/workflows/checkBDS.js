const exec = require('child_process').exec;
const fs = require('fs');
/**
 * aaabbbcc refs/tags/1.xx.yy.zz
*/
const lastCommitMessage = process.argv[2];
const lastVersions = lastCommitMessage.matchAll(/refs\/tags\/([0-9.]+)/g);
/**
 * @type string[]
 */
const knownVersions = [];
for (const v of lastVersions) knownVersions.push(v[1]);
console.log(knownVersions);

(async () => {
    const data = await (await fetch("https://www.minecraft.net/en-us/download/server/bedrock")).text()
    const winURL = data.match(/https:\/\/www\.minecraft\.net\/bedrockdedicatedserver\/bin-win\/bedrock-server-([0-9.]+)\.zip/)[0]
    const linuxURL = data.match(/https:\/\/www\.minecraft\.net\/bedrockdedicatedserver\/bin-linux\/bedrock-server-([0-9.]+)\.zip/)[0]

    const version = winURL.match(/bedrock-server-([0-9.]+)\.zip/)[1]
    if (knownVersions.includes(version)) {
        console.log("skip")
        process.exit(0)
    }
    console.log(version)
    fs.mkdirSync("../../../windows", { recursive: true })
    fs.mkdirSync("../../../linux", { recursive: true })
    await Promise.all([download(winURL, `../../../windows/bedrock-server-${version}-win.zip`), download(linuxURL, `../../../linux/bedrock-server-${version}-linux.zip`)])
})()
async function download(url, path) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(path, buffer);
}
