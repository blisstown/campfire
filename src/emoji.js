import { Client } from './client/client.js';

export const EMOJI_REGEX = /:[\w\-.]{0,32}@[\w\-.]{0,32}:/g;
export const EMOJI_NAME_REGEX = /:[\w\-.]{0,32}:/g;

export default class Emoji {
    id;
    name;
    host;
    url;

    constructor(id, name, host, url) {
        this.id = id;
        this.name = name;
        this.host = host;
        this.url = url;
    }

    get html() {
        return `<img src="${this.url}" class="emoji" height="20" title="${this.name}" alt="${this.name}">`;
    }
}

export function parseText(text, host) {
    if (!text) return text;
    
    let index = text.search(EMOJI_NAME_REGEX);
    if (index === -1) return text;

    // find the emoji name
    let length = text.substring(index + 1).search(':');
    if (length <= 0) return text;
    let emoji_name = text.substring(index + 1, index + length + 1);
    let emoji = Client.get().getEmoji(emoji_name + '@' + host);

    if (emoji) {
        return text.substring(0, index) + emoji.html +
            parseText(text.substring(index + length + 2), host);
    }
    return text.substring(0, index + length + 1) +
        parseText(text.substring(index + length + 1), host);
}

export function parseOne(emoji_id) {
    if (emoji_id == '❤') return '❤️'; // stupid heart unicode
    if (EMOJI_REGEX.exec(':' + emoji_id + ':')) return emoji_id;
    let cached_emoji = Client.get().getEmoji(emoji_id);
    if (!cached_emoji) return emoji_id;
    return cached_emoji.html;
}
