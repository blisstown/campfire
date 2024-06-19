import * as mastodonAPI from '../api/mastodon.js';
import * as firefishAPI from '../api/firefish.js';
import * as misskeyAPI from '../api/misskey.js';

let client = false;

export const server_types = {
    INCOMPATIBLE: "incompatible",
    MASTODON: "mastodon",
    FIREFISH: "firefish",
};

const save_name = "spacesocial";

const versions_types = [
    { version: "mastodon", type: server_types.MASTODON },
    { version: "glitchsoc", type: server_types.MASTODON },
    { version: "chuckya", type: server_types.MASTODON },
    { version: "iceshrimp", type: server_types.FIREFISH },
    { version: "sharkey", type: server_types.FIREFISH },
];

export class Client {
    #api;
    instance;
    app;
    #cache;

    constructor() {
        this.instance = null;
        this.app = null;
        this.cache = {
            users: {},
            emojis: {},
        };
    }

    static get() {
        if (client) return client;
        client = new Client();
        window.peekie = client;
        client.load();
        if (client.instance) client.#configureAPI();
        return client;
    }

    async init(host) {
        if (host.startsWith("https://")) host = host.substring(8);
        const url = "https://" + host + "/api/v1/instance";
        const data = await fetch(url).then(res => res.json());
        this.instance = {
            host: host,
            version: data.version,
            type: server_types.INCOMPATIBLE,
        };

        for (let index in versions_types) {
            const pair = versions_types[index];
            if (data.version.toLowerCase().includes(pair.version)) {
                this.instance.type = pair.type;
                break;
            }
        }

        this.#configureAPI();
        this.app = await this.api.createApp(host);

        if (!this.app || !this.instance) {
            console.error("Failed to create app. Check the network logs for details.");
            return false;
        }

        return this.auth;
    }

    #configureAPI() {
        switch (this.instance.type) {
            case server_types.MASTODON:
                this.api = mastodonAPI;
                break;
            case server_types.FIREFISH:
                this.api = firefishAPI;
                break;
            /* not opening that can of worms for a while
            case server_types.MISSKEY:
                this.api = misskeyAPI;
                break; */
            default:
                break;
        }
    }

    getOAuthUrl() {
        return this.api.getOAuthUrl(this.app.secret);
    }

    async getToken(code) {
        const token = await this.api.getToken(code);
        if (!token) {
            console.error("Failed to obtain access token");
            return false;
        }
        this.app.token = token;
    }

    async revokeToken() {
        return await this.api.revokeToken();
    }

    async getTimeline(last_post_id) {
        return await this.api.getTimeline(last_post_id);
    }

    async getPost(post_id, num_replies) {
        return await this.api.getPost(post_id, num_replies);
    }

    putCacheUser(user) {
        this.cache.users[user.id] = user;
    }

    async getUser(user_id) {
        let user = this.cache.users[user_id];
        if (user) return user;

        user = await this.api.getUser(user_id);
        if (user) return user;

        return false;
    }

    async getUserByMention(mention) {
        let users = Object.values(this.cache.users);
        for (let i in users) {
            const user = users[i];
            if (user.mention == mention) return user;
        }
        return false;
    }

    putCacheEmoji(emoji) {
        this.cache.emojis[emoji.id] = emoji;
    }

    getEmoji(emoji_id) {
        let emoji = this.cache.emojis[emoji_id];
        if (!emoji) return false;
        return emoji;
    }

    save() {
        localStorage.setItem(save_name, JSON.stringify({
            instance: this.instance,
            app: this.app,
        }));
    }

    load() {
        let json = localStorage.getItem(save_name);
        if (!json) return false;
        let saved = JSON.parse(json);
        this.instance = saved.instance;
        this.app = saved.app;
        return true;
    }

    async logout() {
        if (!this.instance || !this.app || !this.api) return;
        if (!await this.revokeToken()) {
            console.warn("Failed to log out correctly; ditching the old tokens anyways.");
        }
        localStorage.removeItem(save_name);
        client = new Client();
        console.log("Logged out successfully.");
    }
}
