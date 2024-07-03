import * as api from '$lib/api.js';
import { writable } from 'svelte/store';
import { app_name } from '$lib/config.js';
import { browser } from "$app/environment";

const server_types = {
    UNSUPPORTED: "unsupported",
    MASTODON: "mastodon",
    GLITCHSOC: "glitchsoc",
    CHUCKYA: "chuckya",
    FIREFISH: "firefish",
    ICESHRIMP: "iceshrimp",
    SHARKEY: "sharkey",
    AKKOMA: "akkoma", // TODO: verify
    PLEROMA: "pleroma", // TODO: verify
};

export const capabilities = {
    MARKDOWN_CONTENT: "mdcontent",
    REACTIONS: "reactions",
};

// if server is falsy, assume user has not begun the login process.
export let server = writable(loadServer());

// write to localStorage on each update
server.subscribe(server => {
    saveServer(server);
});

/**
 * Attempts to create an server object using a given hostname.
 * @param {string} host - The domain of the target server.
 */
export async function createServer(host) {
    if (!host) {
        console.error("Attempted to create server without providing a hostname");
        return false;
    }
    if (host.startsWith("http://")) {
        console.error("Cowardly refusing to connect to an insecure server");
        return false;
    }

    let server = {};
    server.host = host;

    if (host.startsWith("https://")) host = host.substring(8);
    const data = await api.getInstance(host);
    if (!data) {
        console.error(`Failed to connect to ${host}`);
        return false;
    }

    server.version = data.version;
    server.type = getType(server.version);
    server.capabilities = getCapabilities(server.type);

    if (server.type === server_types.UNSUPPORTED) {
        console.warn(`Server ${host} is unsupported (${server.version}). Things may break, or not work as expected`);
    } else {
        console.log(`Server detected as "${server.type}" (${server.version}) with capabilities: {${server.capabilities.join(', ')}}`);
    }

    return server;
}

/**
 * Saves the provided server to localStorage.
 * If `server` is falsy, data is removed from localStorage.
 * @param {Object} server
 */
function saveServer(server) {
    if (!browser) return;
    if (!server) localStorage.removeItem(app_name + "_server");
    localStorage.setItem(app_name + "_server", JSON.stringify(server));
}

/**
 * Returns server data loaded from localStorage, if it exists.
 * Otherwise, returns false.
 */
function loadServer() {
    if (!browser) return;
    let data = localStorage.getItem(app_name + "_server");
    if (!data) return false;
    return JSON.parse(data);
}

/**
 * Returns the type of an server, inferred from its version string.
 * @param {string} version
 * @returns the inferred server_type
 */
function getType(version) {
    if (version.constructor !== String) return;
    let version_lower = version.toLowerCase();
    for (let i = 1; i < Object.keys(server_types).length; i++) {
        const type = Object.values(server_types)[i];
        if (version_lower.includes(type)) {
            return type;
        }
    }
    return server_types.UNSUPPORTED;
}

/**
 * Returns a list of capabilities for a given server_type.
 * @param {string} type
 */
function getCapabilities(type) {
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
            // mastodon API already hands html to us
            //c.push(capabilities.MARKDOWN_CONTENT);
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
