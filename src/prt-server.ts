#!/usr/bin/env node
import util from "util";
import child_process from "child_process";
const exec = util.promisify(child_process.exec);
import path from "path";
import { promises as fs } from "fs";

import express from "express";

import { Queue } from "./Queue";
import { Command, isCommand, isHostCommand } from "./Command";
import { isRemoteMetadata } from "./RemoteMetadata";

const app = express();
app.use(express.json());
const port = 5000;

const command_queue = new Queue<Command>();
let client_pid: string;

function PicotronDriveRoot() {
    switch (process.platform) {
        case "win32":
            return path.join(process.env.APPDATA as string, "Picotron", "drive");
        case "darwin":
            return path.join(process.env.HOME as string, "Library", "Application Support", "Picotron", "drive");
        case "linux":
        default:
            return path.join(process.env.HOME as string, ".lexaloffle", "Picotron", "drive");
    }
}

// return a string identifying prt
app.get("/", (_req, res) => {
    res.send("PRT");
})

app.get("/remote", async (req, res) => {
    if (isRemoteMetadata(req.query)) {
        if (client_pid !== req.query.pid) {
            client_pid = req.query.pid;
            command_queue.clear_waitlist();
            console.log("New client connected, waitlist reset");
        }

        client_pid = req.query.pid;
    }

    const cmd = await command_queue.dequeue().catch(() => {
        return { command: "exit" } as Command;
    }) as Command;

    console.log(`Running remote command ${cmd.command}`);

    res.send(cmd.command);
});

app.post("/command", (req, res) => {
    res.setHeader("Content-Type", "text/plain");

    if (isCommand(req.body)) {
        command_queue.enqueue(req.body);
        res.send("OK");
        console.log(`Queued command ${req.body.command}`);
    } else {
        res.send("KO");
        console.log(`Failed to queue command! Is the request formatted correctly?`);
    }
});

app.get("/host-command", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");

    if (isHostCommand(req.query)) {
        // get the pwd relative to the root of the picotron drive
        const cwd = path.join(PicotronDriveRoot(), req.query.pwd);

        const cwdstat = await fs.stat(cwd).catch(() => null);
        // if cwd is not a directory (for example, cwd is in a .p64 file) or if path is invalid, return error
        if (!cwdstat || !cwdstat.isDirectory()) {
            res.send(`Current working directory (${cwd}) is not a directory!`);
            console.log(`Couldn't run host command (${req.query.command}). Current working directory (${cwd}) is invalid!`);
            return;
        }

        console.log(`Running host command (${req.query.command}) in directory (${cwd})`);

        const {stderr, stdout, code} = await exec(req.query.command, { cwd })
            .catch((err) => err);

        if (typeof code === "string") {
            res.send(code);
            return;
        }

        if (stderr) {
            res.send(stderr);
            return;
        }

        if (stdout) {
            res.send(stdout);
            return;
        }
    } else {
        console.log("Failed to run host command! Is the request formatted correctly?");
        res.send("KO");
    }
});

app.get("/close", (_req, res) => {
    command_queue.clear_waitlist();

    console.log("Closing all client connections");
    res.send("OK")
})

app.get("/shutdown", (_req, res) => {
    command_queue.clear_waitlist();
    res.send("OK")

    console.log("Shutting down...");
    setTimeout(() => process.exit(0), 5000)
})

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
