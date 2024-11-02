export interface RemoteMetadata {
    pwd: string
    pid: string
}

export function isRemoteMetadata(o: any): o is RemoteMetadata {
    return ("pwd" in o && typeof o.pwd === "string") &&
        ("pid" in o && typeof o.pid === "string")
}
