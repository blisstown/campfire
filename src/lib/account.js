import { server } from '$lib/client/server.js';
import { parseEmoji, renderEmoji } from '$lib/emoji.js';
import { get, writable } from 'svelte/store';

const cache = writable({});

/**
 * Parses an account using API data, and returns a writable store object.
 * @param {Object} data
 * @param {number} ancestor_count
 */
export function parseAccount(data) {
    if (!data) {
        console.error("Attempted to parse account data but no data was provided");
        return null;
    }
    let account = get(cache)[data.id];
    if (account) return account;
    // cache miss!

    account = {};
    account.id = data.id;
    account.nickname = data.display_name.trim();
    account.username = data.username;
    account.name = account.nickname || account.username;
    account.avatar_url = data.avatar;
    account.url = data.url;

    if (data.acct.includes('@'))
        account.host = data.acct.split('@')[1];
    else
        account.host = get(server).host;

    account.mention = "@" + account.username;
    if (account.host != get(server).host)
        account.mention += "@" + account.host;
    
    account.emojis = {};
    data.emojis.forEach(emoji => {
        account.emojis[emoji.shortcode] = parseEmoji(emoji.shortcode, emoji.url);
    });

    account.rich_name = account.nickname ? renderEmoji(account.nickname, account.emojis) : account.username;

    cache.update(cache => {
        cache[account.id] = account;
        return cache;
    });

    return account;
}

