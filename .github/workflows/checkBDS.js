const exec = require('child_process').exec;
const fs = require('fs');
/**
 * bump: x.x.x.x
 */
const lastCommitMessage = process.argv[2];
const lastVersion = lastCommitMessage.match(/bump: ([0-9.]+)/)?.[1];

(async () => {
    const data = await (await fetch("https://www.minecraft.net/en-us/download/server/bedrock")).text()
    const winURL = data.match(/https:\/\/minecraft\.azureedge\.net\/bin-win\/bedrock-server-([0-9.]+)\.zip/)[0]
    const linuxURL = data.match(/https:\/\/minecraft\.azureedge\.net\/bin-linux\/bedrock-server-([0-9.]+)\.zip/)[0]

    const version = winURL.match(/bedrock-server-([0-9.]+)\.zip/)[1]
    if (version === lastVersion) {
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
