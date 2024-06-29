import { Client } from '../client/client.js';
import { capabilities } from '../client/instance.js';
import Post from '../post.js';
import User from '../user/user.js';
import Emoji from '../emoji.js';
import { get } from 'svelte/store';

export async function createApp(host) {
    let form = new FormData();
    form.append("client_name", "space social");
    form.append("redirect_uris", `${location.origin}/callback`);
    form.append("scopes", "read write push");
    form.append("website", "https://spacesocial.arimelody.me");

    const res = await fetch(`https://${host}/api/v1/apps`, {
        method: "POST",
        body: form,
    })
    .then(res => res.json())
    .catch(error => {
        console.error(error);
        return false;
    });

    if (!res || !res.client_id) return false;

    return {
        id: res.client_id,
        secret: res.client_secret,
    };
}

export function getOAuthUrl() {
    let client = get(Client.get());
    return `https://${client.instance.host}/oauth/authorize` +
        `?client_id=${client.app.id}` +
        "&scope=read+write+push" +
        `&redirect_uri=${location.origin}/callback` +
        "&response_type=code";
}

export async function getToken(code) {
    let client = get(Client.get());
    let form = new FormData();
    form.append("client_id", client.app.id);
    form.append("client_secret", client.app.secret);
    form.append("redirect_uri", `${location.origin}/callback`);
    form.append("grant_type", "authorization_code");
    form.append("code", code);
    form.append("scope", "read write push");

    const res = await fetch(`https://${client.instance.host}/oauth/token`, {
        method: "POST",
        body: form,
    })
    .then(res => res.json())
    .catch(error => {
        console.error(error);
        return false;
    });

    if (!res || !res.access_token) return false;

    return res.access_token;
}

export async function revokeToken() {
    let client = get(Client.get());
    let form = new FormData();
    form.append("client_id", client.app.id);
    form.append("client_secret", client.app.secret);
    form.append("token", client.app.token);

    const res = await fetch(`https://${client.instance.host}/oauth/revoke`, {
        method: "POST",
        body: form,
    })
    .catch(error => {
        console.error(error);
        return false;
    });

    if (!res.ok) return false;
    return true;
}

export async function verifyCredentials() {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/accounts/verify_credentials`;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => res.json());

    return data;
}

export async function getTimeline(last_post_id) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/timelines/home`;
    if (last_post_id) url += "?max_id=" + last_post_id;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => res.json());

    return data;
}

export async function getPost(post_id, ancestor_count) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}`;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function getPostContext(post_id) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}/context`;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function boostPost(post_id) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}/reblog`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function unboostPost(post_id) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}/unreblog`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function favouritePost(post_id) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}/favourite`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function unfavouritePost(post_id) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}/unfavourite`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function reactPost(post_id, shortcode) {
    // for whatever reason (at least in my testing on iceshrimp)
    // using shortcodes for external emoji results in a fallback
    // to the default like emote.
    // identical api calls on chuckya instances do not display
    // this behaviour.
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}/react/${encodeURIComponent(shortcode)}`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function unreactPost(post_id, shortcode) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}/unreact/${encodeURIComponent(shortcode)}`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;
    return data;
}

export async function parsePost(data, ancestor_count, with_context) {
    let client = get(Client.get());
    let post = new Post();

    post.text = data.content;

    post.reply = null;
    if (!with_context && // ancestor replies are handled in full later
        (data.in_reply_to_id || data.reply) &&
        ancestor_count !== 0
    ) {
        const reply_data = data.reply || await getPost(data.in_reply_to_id, ancestor_count - 1);
        // if the post returns false, we probably don't have permission to read it.
        // we'll respect the thread's privacy, and leave it alone :)
        if (!reply_data) return false;
        post.reply = await parsePost(reply_data, ancestor_count - 1, false);
    }
    post.boost = data.reblog ? await parsePost(data.reblog, 1, false) : null;

    post.replies = [];
    if (with_context) {
        const replies_data = await getPostContext(data.id);
        if (replies_data) {
            // posts this is replying to
            if (replies_data.ancestors) {
                let head = post;
                while (replies_data.ancestors.length > 0) {
                    head.reply = await parsePost(replies_data.ancestors.pop(), 0, false);
                    head = head.reply;
                }
            }
            // posts in reply to this
            if (replies_data.descendants) {
                for (let i in replies_data.descendants) {
                    post.replies.push(await parsePost(replies_data.descendants[i], 0, false));
                }
            }
        }
    }

    post.id = data.id;
    post.created_at = new Date(data.created_at);
    post.user = await parseUser(data.account);
    post.warning = data.spoiler_text;
    post.boost_count = data.reblogs_count;
    post.reply_count = data.replies_count;
    post.favourite_count = data.favourites_count;
    post.favourited = data.favourited;
    post.boosted = data.reblogged;
    post.mentions = data.mentions;
    post.files = data.media_attachments;
    post.url = data.url;
    post.visibility = data.visibility;

    post.emojis = [];
    if (data.emojis) {
        data.emojis.forEach(emoji_data => {
            let name = emoji_data.shortcode.split('@')[0];
            post.emojis.push(parseEmoji({
                id: name + '@' + post.user.host,
                name: name,
                host: post.user.host,
                url: emoji_data.url,
            }));
        });
    }

    if (data.reactions && client.instance.capabilities.includes(capabilities.REACTIONS)) {
        post.reactions = parseReactions(data.reactions);
    }
    return post;
}

export async function parseUser(data) {
    if (!data) {
        console.error("Attempted to parse user data but no data was provided");
        return null;
    }
    let client = get(Client.get());
    let user = await client.getCacheUser(data.id);

    if (user) return user;
    // cache miss!

    user = new User();
    user.id = data.id;
    user.nickname = data.display_name;
    user.username = data.username;
    user.avatar_url = data.avatar;
    user.url = data.url;

    if (data.acct.includes('@'))
        user.host = data.acct.split('@')[1];
    else
        user.host = client.instance.host;

    user.emojis = [];
    data.emojis.forEach(emoji_data => {
        emoji_data.id = emoji_data.shortcode + '@' + user.host;
        emoji_data.name = emoji_data.shortcode;
        emoji_data.host = user.host;
        user.emojis.push(parseEmoji(emoji_data));
    });

    client.putCacheUser(user);
    return user;
}

export function parseReactions(data) {
    let client = get(Client.get());
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

export function parseEmoji(data) {
    let emoji = new Emoji(
        data.id,
        data.name,
        data.host,
        data.url,
    );
    get(Client.get()).putCacheEmoji(emoji);
    return emoji;
}

export async function getUser(user_id) {
    let client = get(Client.get());
    let url = `https://${client.instance.host}/api/v1/accounts/${user_id}`;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => res.json());

    const user = await parseUser(data);
    if (user === null || user === undefined) {
        if (data.id) {
            console.warn("Failed to parse user data #" + data.id);
        } else {
            console.warn("Failed to parse user data:");
            console.warn(data);
        }
        return false;
    }
    return user;
}
