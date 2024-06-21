export const server_types = {
    UNSUPPORTED: "unsupported",
    MASTODON: "mastodon",
    GLITCHSOC: "glitchsoc",
    CHUCKYA: "chuckya",
    FIREFISH: "firefish",
    ICESHRIMP: "iceshrimp",
    SHARKEY: "sharkey",
};

export const capabilities = {
    MARKDOWN_CONTENT: "mdcontent",
    REACTIONS: "reactions",
};

export class Instance {
    host;
    version;
    capabilities;
    type = server_types.UNSUPPORTED;

    constructor(host, version) {
        this.host = host;
        this.version = version;
        this.#setType(version);
        this.capabilities = this.#getCapabilities(this.type);
    }

    #setType(version) {
        if (version.constructor !== String) return;
        let version_lower = version.toLowerCase();
        for (let i = 1; i < Object.keys(server_types).length; i++) {
            const check_type = Object.values(server_types)[i];
            if (version_lower.includes(check_type)) {
                this.type = check_type;
                break;
            }
        }
        if (this.type === server_types.UNSUPPORTED) return;
    }

    #getCapabilities(type) {
        let c = [];
        switch (type) {
            case server_types.MASTODON:
                break;
            case server_types.GLITCHSOC:
                c.push(capabilities.REACTIONS);
                break;
            case server_types.CHUCKYA:
                c.push(capabilities.REACTIONS);
                break;
            case server_types.FIREFISH:
                c.push(capabilities.REACTIONS);
                break;
            case server_types.ICESHRIMP:
                // more trouble than it's worth atm
                // the server already hands this to us ;p
                // c.push(capabilities.MARKDOWN_CONTENT);
                c.push(capabilities.REACTIONS);
                break;
            case server_types.SHARKEY:
                c.push(capabilities.REACTIONS);
                break;
            default:
                break;
        }
        return c;
    }
}
