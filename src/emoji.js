import Instance from './instance.js';

const EMOJI_REGEX = /:[a-z0-9_\-]+:/g;

let emoji_cache = [];

export default class Emoji {
    name;
    host;
    url;
    width;
    height;

    static parse(data, host) {
        const instance = Instance.get_instance();
        let emoji = null;
        switch (instance.type) {
            case Instance.types.ICESHRIMP:
                emoji = Emoji.#parse_iceshrimp(data);
                break;
            case Instance.types.MASTODON:
                emoji = Emoji.#parse_mastodon(data);
                break;
            default:
                break;
        }
        if (emoji !== null) emoji_cache.push(emoji);
        return emoji;
    }

    static #parse_iceshrimp(data, host) {
        let emoji = new Emoji()
        emoji.name = data.name.substring(1, data.name.search('@'));
        emoji.host = host;
        emoji.url = data.url;
        emoji.width = data.width;
        emoji.height = data.height;
        return emoji;
    }

    static #parse_mastodon(data, host) {
        let emoji = new Emoji()
        emoji.name = data.shortcode;
        emoji.host = host;
        emoji.url = data.url;
        emoji.width = data.width;
        emoji.height = data.height;
        return emoji;
    }

    get id() {
        return this.name + '@' + this.host;
    }
}

export function parse_text(text, ignore_instance) {
    if (!text) return text;
    
    let index = text.search(EMOJI_REGEX);
    if (index === -1) return text;
    index++;

    // find the emoji name
    let length = 0;
    while (index + length < text.length && text[index + length] !== ':') length++;
    let emoji_name = ':' + text.substring(index, index + length) + ':';

    // does this emoji exist?
    let emoji;
    for (let cached in emoji_cache) {
        if (cached.id === emoji_name) {
            emoji = cached;
            break;
        }
    }

    if (!emoji) return text.substring(0, index + length) + parse_text(text.substring(index + length));

    // replace emoji code with <img>
    const img = `<img src="${emoji.url}" class="emoji" width="26" height="26" title=":${emoji_name}:" alt="${emoji_name}">`;
    return text.substring(0, index - 1) + img +
        parse(text.substring(index + length + 1), emojis, ignore_instance);
}

export function parse_one(reaction, emojis) {
    if (reaction == '❤') return '❤️'; // stupid heart unicode
    if (!reaction.startsWith(':') || !reaction.endsWith(':')) return reaction;
    for (let i = 0; i < emojis.length; i++) {
        if (emojis[i].name == reaction.substring(1, reaction.length - 1))
            return `<img src="${emojis[i].url}" class="emoji" width="26" height="26" title="${reaction}" alt="${emojis[i].name}">`;
    }
    return reaction;
}
