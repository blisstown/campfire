import Instance from '../instance.js';
import Emoji from '../emoji.js';

let user_cache = Object;

export default class User {
    id;
    nickname;
    username;
    host;
    avatar_url;
    emojis;

    static resolve_id(id) {
        return user_cache[id];
    }

    static resolve_mention(mention) {
        for (let i = 0; i < Object.keys(user_cache).length; i++) {
            let user = user_cache[Object.keys(user_cache)[i]];
            if (user.mention === mention) return user;
        }
    }

    static parse(data) {
        const instance = Instance.get_instance();
        let user = null;
        switch (instance.type) {
            case Instance.types.ICESHRIMP:
                user = User.#parse_iceshrimp(data);
                break;
            case Instance.types.MASTODON:
                user = User.#parse_mastodon(data);
                break;
            default:
                break;
        }
        if (!user) {
            console.error("Error while parsing user data");
            return null;
        }
        user_cache[user.id] = user;
        return user;
    }

    static #parse_iceshrimp(data) {
        let user = new User();
        user.id = data.id;
        user.nickname = data.name;
        user.username = data.username;
        user.host = data.host || Instance.get_instance().host;
        user.avatar_url = data.avatarUrl;
        user.emojis = [];
        data.emojis.forEach(emoji => {
            user.emojis.push(Emoji.parse(emoji, user.host));
        });
        return user;
    }

    static #parse_mastodon(data) {
        let user = new User();
        user.id = data.id;
        user.nickname = data.display_name;
        user.username = data.username;
        user.host = data.acct.search('@') ? data.acct.substring(data.acct.search('@') + 1) : instance.host;
        user.avatar_url = data.avatar;
        user.emojis = [];
        data.emojis.forEach(emoji => {
            user.emojis.push(Emoji.parse(emoji, user.host));
        });
        return user;
    }

    get name() {
        return this.nickname || this.username;
    }

    get mention() {
        let res = "@" + this.username;
        if (this.host) res += "@" + this.host;
        return res;
    }
}
