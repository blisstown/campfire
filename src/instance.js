import Post from './post/post.js';

let instance;

const ERR_UNSUPPORTED = "Unsupported server";
const ERR_SERVER_RESPONSE = "Unsupported response from the server";

export default class Instance {
    #host;
    #token;
    #type;
    #secure;

    static types = {
        ICESHRIMP: "iceshrimp",
        MASTODON: "mastodon",
        MISSKEY: "misskey",
        AKKOMA: "akkoma",
    };

    static get_instance() {
        if (!instance) instance = new Instance();
        return instance;
    }

    static async setup(host, token, secure) {
        instance = Instance.get_instance();
        instance.host = host;
        instance.token = token;
        instance.secure = secure;
        await instance.#guess_type();
    }

    async #guess_type() {
        const url = instance.#proto + instance.host + "/api/v1/instance";
        console.log("Snooping for instance information at " + url + "...");
        const res = await fetch(url);
        const data = await res.json();
        const version = data.version.toLowerCase();

        instance.type = Instance.types.MASTODON;
        if (version.search("iceshrimp") !== -1) instance.type = Instance.types.ICESHRIMP;
        if (version.search("misskey") !== -1) instance.type = Instance.types.MISSKEY;
        if (version.search("akkoma") !== -1) instance.type = Instance.types.AKKOMA;

        console.log("Assumed server type to be \"" + instance.type + "\".");
    }

    static async get_timeline(last_post_id) {
        let data = null;
        switch (instance.type) {
            case Instance.types.ICESHRIMP:
                data = await instance.#get_timeline_iceshrimp(last_post_id);
                break;
            case Instance.types.MASTODON:
                data = await instance.#get_timeline_mastodon(last_post_id);
                break;
            default:
                console.error(ERR_UNSUPPORTED);
                return null;
        }
        if (data.constructor != Array) {
            console.error(ERR_SERVER_RESPONSE);
            return null;
        }
        let posts = [];
        data.forEach(post_data => {
            const post = Post.parse(post_data);
            if (!post) return;
            posts = [...posts, post];
        });
        return posts;
    }

    async #get_timeline_iceshrimp(last_post_id) {
        let body = Object;
        if (last_post_id) body.untilId = last_post_id;
        const res = await fetch(this.#proto + this.host + "/api/notes/timeline", {
            method: 'POST',
            headers: { "Authorization": "Bearer " + this.token },
            body: JSON.stringify(body)
        });
        return await res.json();
    }

    async #get_timeline_mastodon(last_post_id) {
        let url = this.#proto + this.host + "/api/v1/timelines/home";
        if (last_post_id) url += "?max_id=" + last_post_id;
        const res = await fetch(url, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + this.token }
        });
        return await res.json();
    }

    get #proto() {
        if (this.secure) return "https://";
        return "http://";
    }

    static get ok() {
        if (!instance) return false;
        if (!instance.host) return false;
        if (!instance.token) return false;
        return true;
    }
}
