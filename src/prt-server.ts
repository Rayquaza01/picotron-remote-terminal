#!/usr/bin/env node
import util from "util";
import child_process from "child_process";
const exec = util.promisify(child_process.exec);
import path from "path";
import fs from "fs";
const lstat = util.promisify(fs.lstat);

import express from "express";

import { Queue } from "./Queue";
import { Command, isCommand, isHostCommand } from "./Command";
import { isRemoteMetadata } from "./RemoteMetadata";

const app = express();
app.use(express.json());
const port = 5000;

const command_queue = new Queue<Command>();
let client_pid: string;

app.get("/v", (_req, res) => {
    res.send("PRT")
})

app.get("/remote", async (req, res) => {
    if (isRemoteMetadata(req.query)) {
        if (client_pid !== req.query.pid) {
            client_pid = req.query.pid;
            command_queue.clear_waitlist();
        }

        client_pid = req.query.pid;
    }

    const cmd = await command_queue.dequeue().catch(() => {
        return { command: "exit" } as Command
    }) as Command;

    res.send(cmd.command);
});

app.post("/command", (req, res) => {
    res.setHeader("Content-Type", "text/plain");

    if (isCommand(req.body)) {
        command_queue.enqueue(req.body);
        res.send("OK");
    } else {
        res.send("KO");
    }
});

app.get("/host-command", async (req, res) => {
    res.setHeader("Content-Type", "text/plain")

    if (isHostCommand(req.query)) {
        const cwd = path.join(process.env.HOME as string, ".lexaloffle/Picotron/drive/", req.query.pwd);
        if (!(await lstat(cwd)).isDirectory()) {
            res.send("Directory does not exist");
            return;
        }

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
        res.send("KO")
    }
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
