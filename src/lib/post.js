import * as api from '$lib/api.js';
import { server } from '$lib/client/server.js';
import { app } from '$lib/client/app.js';
import { parseAccount } from '$lib/account.js';
import { parseEmoji, renderEmoji } from '$lib/emoji.js';
import { get, writable } from 'svelte/store';

const cache = writable({});

/**
 * Parses a post using API data, and returns a writable store object.
 * @param {Object} data
 * @param {number} ancestor_count
 */
export async function parsePost(data, ancestor_count) {
    let post = {};
    if (!ancestor_count) ancestor_count = 0;

    post.html = data.content;

    post.reply = null;
    if ((data.in_reply_to_id || data.reply) && ancestor_count !== 0) {
        const reply_data = data.reply || await api.getPost(get(server).host, get(app).token, data.in_reply_to_id);
        // if the post returns false, we probably don't have permission to read it.
        // we'll respect the thread's privacy, and leave it alone :)
        if (!reply_data) return false;
        post.reply = await parsePost(reply_data, ancestor_count - 1, false);
    }

    post.boost = data.reblog ? await parsePost(data.reblog, 1, false) : null;

    post.id = data.id;
    post.created_at = new Date(data.created_at);
    post.account = await parseAccount(data.account);
    post.warning = data.spoiler_text;
    post.reply_count = data.replies_count;
    post.boost_count = data.reblogs_count;
    post.boosted = data.reblogged;
    post.favourite_count = data.favourites_count;
    post.favourited = data.favourited;
    post.mentions = data.mentions;
    post.media = data.media_attachments;
    post.url = data.url;
    post.visibility = data.visibility;

    post.emojis = [];
    data.emojis.forEach(emoji => {
        post.emojis[emoji.shortcode] = parseEmoji(emoji.shortcode, emoji.url);
    });

    if (data.reactions) post.reactions = parseReactions(data.reactions);

    post.rich_text = renderEmoji(post.html, post.emojis);

    return post;

    // let cache_post = get(cache)[post.id];
    // if (cache_post) {
    //     cache_post.set(post);
    // } else {
    //     cache.update(cache => {
    //         cache[post.id] = writable(post);
    //         return cache;
    //     });
    // }

    // return get(cache)[post.id];
}

export function parseReactions(data) {
    let reactions = [];
    data.forEach(reaction_data => {
        let reaction = {
            count: reaction_data.count,
            name: reaction_data.name,
            me: reaction_data.me,
        };
        if (reaction_data.url) reaction.url = reaction_data.url;
        reactions.push(reaction);
    });
    return reactions;
}
