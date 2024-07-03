import { get } from 'svelte/store';
export const EMOJI_REGEX = /:[\w\-.]{0,32}:/g;

export function parseEmoji(shortcode, url) {
    let emoji = { shortcode, url };
    if (emoji.shortcode == '❤') emoji.shortcode = '❤️'; // stupid heart unicode
    emoji.html = `<img src="${emoji.url}" class="emoji" height="20" title="${emoji.shortcode}" alt="${emoji.shortcode}"/>`;
    return emoji;
}

export function renderEmoji(text, emoji_list) {
    if (!text) return text;
    
    let index = text.search(EMOJI_REGEX);
    if (index === -1) return text;

    // find the closing comma
    let length = text.substring(index + 1).search(':');
    if (length <= 0) return text;

    // see if emoji is valid
    let shortcode = text.substring(index + 1, index + length + 1);
    let emoji = emoji_list[shortcode];
    let replace = emoji ? emoji.html : shortcode;

    return text.substring(0, index) + replace + renderEmoji(text.substring(index + length + 2), emoji_list);
}
