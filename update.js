const platform = process.platform
const { exec } = require('child_process')
const fs = require('fs');

(async () => {
    await execAsync("git pull")
    const latestData = await (await fetch("https://api.github.com/repos/SYOSIN-MC/BDS-Versions/releases/latest")).json()
    switch (platform) {
        case "win32": {
            const downloadURL = latestData["assets"][1]["browser_download_url"]
            await download(downloadURL, "./bedrock_server.exe")
            break
        }
        case "linux": {
            const downloadURL = latestData["assets"][0]["browser_download_url"]
            await download(downloadURL, "./bedrock_server")
            break
        }
        default: {
            console.error("Unsupported platform")
            process.exit(1)
        }
    }
})()
async function execAsync(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else {
                resolve(stdout)
            }
        })
    })
}

async function download(url, path) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(path, buffer, {});
}
