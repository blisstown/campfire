import { Client } from '../client/client.js';
import Post from '../post/post.js';
import User from '../user/user.js';
import Emoji from '../emoji.js';

import * as mastodonAPI from './mastodon.js';

export async function createApp(host) {
    return await mastodonAPI.createApp(host);
}

export function getOAuthUrl() {
    return mastodonAPI.getOAuthUrl();
}

export async function getToken(code) {
    return await mastodonAPI.getToken(code);
}

export async function revokeToken() {
    return await mastodonAPI.revokeToken();
}

export async function getTimeline(last_post_id) {
    return await mastodonAPI.getTimeline(last_post_id);
}

export async function getPost(post_id, num_replies) {
    return await mastodonAPI.getPost(post_id, num_replies);
}

export async function parsePost(data, num_replies) {
    let client = Client.get();
    let post = new Post()
    post.id = data.id;
    post.created_at = new Date(data.created_at);
    post.user = await Client.get().api.parseUser(data.account);
    post.text = data.text;
    post.warning = data.spoiler_text;
    post.boost_count = data.reblogs_count;
    post.reply_count = data.replies_count;
    post.mentions = data.mentions;
    post.reactions = data.reactions;
    post.files = data.media_attachments;
    post.url = data.url;
    post.reply = data.in_reply_to_id && num_replies > 0 ? await getPost(data.in_reply_to_id, num_replies - 1) : null;
    post.boost = data.reblog ? await parsePost(data.reblog, 1) : null;
    post.emojis = [];
    data.emojis.forEach(emoji_data => {
        let name = emoji_data.shortcode.split('@')[0];
        post.emojis.push(Client.get().api.parseEmoji({
            id: name + '@' + post.user.host,
            name: name,
            host: post.user.host,
            url: emoji_data.url,
        }));
    });
    post.reactions = [];
    data.reactions.forEach(reaction_data => {
        if (/^[\w\-.@]+$/g.exec(reaction_data.name)) {
            let name = reaction_data.name.split('@')[0];
            let host = reaction_data.name.includes('@') ? reaction_data.name.split('@')[1] : client.instance.host;
            post.reactions.push({
                count: reaction_data.count,
                emoji: Client.get().api.parseEmoji({
                    id: name + '@' + host,
                    name: name,
                    host: host,
                    url: reaction_data.url,
                }),
                me: reaction_data.me,
            });
        } else {
            if (reaction_data.name == '❤') reaction_data.name = '❤️'; // stupid heart unicode
            post.reactions.push({
                count: reaction_data.count,
                emoji: {
                    html: reaction_data.name,
                    name: reaction_data.name,
                },
                me: reaction_data.me,
            });
        }
    });
    return post;
}

export async function parseUser(data) {
    return mastodonAPI.parseUser(data);
}

export function parseEmoji(data) {
    return mastodonAPI.parseEmoji(data);
}

export async function getUser(user_id) {
    return mastodonAPI.getUser(user_id);
}
