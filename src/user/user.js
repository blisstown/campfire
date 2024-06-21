import { Client } from '../client/client.js';
import { parseText as parseEmojis } from '../emoji.js';

export default class User {
    id;
    nickname;
    username;
    host;
    avatar_url;
    emojis;
    url;

    get name() {
        return this.nickname || this.username;
    }

    get mention() {
        let res = "@" + this.username;
        if (this.host != Client.get().instance.host)
            res += "@" + this.host;
        return res;
    }

    get rich_name() {
        if (!this.nickname) return this.username;
        return parseEmojis(this.nickname, this.host);
    }
}
