export interface Command {
    /** The text of the command to run. When piped from stdin, display stdin */
    // command_text: string
    /** The command to run */
    command: string
    /** If set, drop request without responding */
    drop?: boolean
}

export function isCommand(c: any): c is Command {
    return ("command" in c && typeof c.command === "string");
}

export interface HostCommand {
    pwd: string
    command: string
}

export function isHostCommand(c: any): c is HostCommand {
    return ("pwd" in c && typeof c.pwd === "string") &&
        ("command" in c && typeof c.command === "string")
}
