# Picotron Remote Terminal

Remotely control Picotron from the host

## Installation

### Install the server application:

```bash
git clone https://github.com/Rayquaza01/picotron-remote-terminal/
cd picotron-remote-terminal
npm install
npm run build
npm install -g .
```

This will install two programs:
 * `prt-server`, which passes messages between Picotron and the host
 * `prt`, which lets you issue commands to Picotron from the host


### Install the client in Picotron:

```bash
# from inside picotron

load #prt
save /appdata/system/util/prt.p64
```

This will install the PRT cartridge, which will listen for commands from `prt-server`.

### (Optional) Install the host script:

```bash
# from inside picotron

# use the location of wherever you saved the prt cart
cp /appdata/system/util/prt.p64/exports/appdata/system/util/host.lua /appdata/system/util
```

This will install the `host` command, which can be used run commands from the host inside of Picotron.

### (Optional) Install as a PUSH module

```bash
# from inside picotron

# use the location of wherever you saved the prt cart
cp /appdata/system/util/prt.p64/exports/appdata/system/terminal/prt.lua /appdata/system/terminal
```

If you are using PUSH, you can integrate PRT directly into the terminal. The push module adds a shell command (prt) that can be used instead of the cart. When using PRT as a PUSH module, command output *will* be displayed in the terminal window.

Supported commands are `start`, `stop`, `restart`, `shutdown`, `status`.

## Usage

### Controlling Picotron From Host

To control Picotron from host, start `prt-server` on the host, and open the PRT cart inside of Picotron.

You can then issue commands by running `prt <COMMAND>` from the host. Output from the commands are not displayed.

#### Tips:

* The `load` command can be used to load a cartridge.
* You can load a folder or a cartridge.
* The `run` command can be used to run the currently loaded cartridge.
* You can start a cart with its exact path.
* You can build or extract a cart with `cp`.
* You can change directories with `cd`, though it may be better to use absolute paths.
* Commands won't go through if there's a fullscreen cart open.
* Sometimes, commands are eaten. I'm not sure the exact cause, but restarting PRT should get it working again.

### Controlling the Host From Picotron

To control the host from Picotron, start `prt-server` on the host.

You can then issue commands by running `host <COMMAND>` from Picotron.

#### Tips:

* Only non-interactive commands work.
* Only characters that can be displayed in Picotron work (so emojis, nerd fonts, ANSI codes, etc. won't display correctly).
* The commands are run with the same PWD as the Picotron terminal where you ran them.
* Relative paths work for accessing the Picotron drive, but absolute paths are used according to the host system.
* You can't run commands when inside of a virtual path (such as `/ram`, `/system`, or inside of a `.p64`).
* You can use pipelines.
