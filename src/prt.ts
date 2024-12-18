#!/usr/bin/env node
import fs from "fs";

let command: string;
if (process.argv.length > 2) {
    command = process.argv.slice(2).join(" ");
} else {
    command = fs.readFileSync(process.stdin.fd, "utf-8");
}

if (!command) {
    process.exit(1);
}

async function main() {
    if (command === "prt-shutdown") {
        console.log("Shutting down prt-server");
        await fetch("http://localhost:5000/shutdown");
        process.exit(0)
    }

    const res = await fetch("http://localhost:5000/command", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ command })
    });

    // const body = await res.text();

    // console.log(body);
}

main();
