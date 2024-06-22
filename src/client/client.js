import { version as APP_VERSION } from '../../package.json';
import { Instance, server_types } from './instance.js';
import * as api from './api.js';

let client = false;

const save_name = "spacesocial";

export class Client {
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
        return client;
    }

    async init(host) {
        if (host.startsWith("https://")) host = host.substring(8);
        const url = `https://${host}/api/v1/instance`;
        const data = await fetch(url).then(res => res.json()).catch(error => { console.error(error) });
        if (!data) {
            console.error(`Failed to connect to ${host}`);
            alert(`Failed to connect to ${host}! Please try again later.`);
            return false;
        }
        
        this.instance = new Instance(host, data.version);
        if (this.instance.type == server_types.UNSUPPORTED) {
            console.warn(`Server ${host} is unsupported - ${data.version}`);
            if (!confirm(
		`This app does not officially support ${host}. ` +
		`Things may break, or otherwise not work as epxected! ` +
		`Are you sure you wish to continue?`
	    )) return false;
        } else {
	    console.log(`Server is "${this.instance.type}" (or compatible) with capabilities: [${this.instance.capabilities}].`);
	}

        this.app = await api.createApp(host);

        if (!this.app || !this.instance) {
            console.error("Failed to create app. Check the network logs for details.");
            return false;
        }

        this.save();

        return true;
    }

    getOAuthUrl() {
        return api.getOAuthUrl(this.app.secret);
    }

    async getToken(code) {
        const token = await api.getToken(code);
        if (!token) {
            console.error("Failed to obtain access token");
            return false;
        }
        this.app.token = token;
    }

    async revokeToken() {
        return await api.revokeToken();
    }

    async getTimeline(last_post_id) {
        return await api.getTimeline(last_post_id);
    }

    async getPost(post_id, num_replies) {
        return await api.getPost(post_id, num_replies);
    }

    putCacheUser(user) {
        this.cache.users[user.id] = user;
    }

    async getUser(user_id) {
        let user = this.cache.users[user_id];
        if (user) return user;

        user = await api.getUser(user_id);
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
            version: APP_VERSION,
            instance: {
                host: this.instance.host,
                version: this.instance.version,
            },
            app: this.app,
        }));
    }

    load() {
        let json = localStorage.getItem(save_name);
        if (!json) return false;
        let saved = JSON.parse(json);
        if (!saved.version || saved.version !== APP_VERSION) {
            localStorage.setItem(save_name + '-backup', json);
            localStorage.removeItem(save_name);
            return false;
        }
        this.instance = new Instance(saved.instance.host, saved.instance.version);
        this.app = saved.app;
        return true;
    }

    async logout() {
        if (!this.instance || !this.app) return;
        if (!await this.revokeToken()) {
            console.warn("Failed to log out correctly; ditching the old tokens anyways.");
        }
        localStorage.removeItem(save_name);
        client = new Client();
        console.log("Logged out successfully.");
    }
}
