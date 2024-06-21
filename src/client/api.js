import { Client } from '../client/client.js';
import { capabilities } from '../client/instance.js';
import Post from '../post/post.js';
import User from '../user/user.js';
import Emoji from '../emoji.js';

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
    let client = Client.get();
    return `https://${client.instance.host}/oauth/authorize` +
        `?client_id=${client.app.id}` +
        "&scope=read+write+push" +
        `&redirect_uri=${location.origin}/callback` +
        "&response_type=code";
}

export async function getToken(code) {
    let client = Client.get();
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
    let client = Client.get();
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

export async function getTimeline(last_post_id) {
    let client = Client.get();
    let url = `https://${client.instance.host}/api/v1/timelines/home`;
    if (last_post_id) url += "?max_id=" + last_post_id;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => res.json());

    return data;

    let posts = [];
    for (let i in data) {
        const post_data = data[i];
        const post = await parsePost(post_data, 1);
        if (!post) {
            if (post === null || post === undefined) {
                if (post_data.id) {
                    console.warn("Failed to parse post #" + post_data.id);
                } else {
                    console.warn("Failed to parse post:");
                    console.warn(post_data);
                }
            }
            continue;
        }
        posts.push(post);
    }
    return posts;
}

export async function getPost(post_id, num_replies) {
    let client = Client.get();
    let url = `https://${client.instance.host}/api/v1/statuses/${post_id}`;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + client.app.token }
    }).then(res => { return res.ok ? res.json() : false });

    if (data === false) return false;

    const post = await parsePost(data, num_replies);
    if (post === null || post === undefined) {
        if (data.id) {
            console.warn("Failed to parse post data #" + data.id);
        } else {
            console.warn("Failed to parse post data:");
            console.warn(data);
        }
        return false;
    }
    return post;
}

export async function parsePost(data, num_replies) {
    let client = Client.get();
    let post = new Post()

    post.id = data.id;
    post.created_at = new Date(data.created_at);
    post.user = await parseUser(data.account);
    post.warning = data.spoiler_text;
    post.boost_count = data.reblogs_count;
    post.reply_count = data.replies_count;
    post.mentions = data.mentions;
    post.files = data.media_attachments;
    post.url = data.url;
    post.visibility = data.visibility;

    if (client.instance.capabilities.includes(capabilities.MARKDOWN_CONTENT))
        post.text = data.text;
    else
        post.text = data.content;

    post.reply = null;
    if (data.in_reply_to_id && num_replies > 0) {
        post.reply = await getPost(data.in_reply_to_id, num_replies - 1);
        // if the post returns false, we probably don't have permission to read it.
        // we'll respect the thread's privacy, and leave it alone :)
        if (post.reply === false) return false;
    }
    post.boost = data.reblog ? await parsePost(data.reblog, 1) : null;

    post.emojis = [];
    data.emojis.forEach(emoji_data => {
        let name = emoji_data.shortcode.split('@')[0];
        post.emojis.push(parseEmoji({
            id: name + '@' + post.user.host,
            name: name,
            host: post.user.host,
            url: emoji_data.url,
        }));
    });

    if (client.instance.capabilities.includes(capabilities.REACTIONS)) {
        post.reactions = [];
        data.reactions.forEach(reaction_data => {
            if (/^[\w\-.@]+$/g.exec(reaction_data.name)) {
                let name = reaction_data.name.split('@')[0];
                let host = reaction_data.name.includes('@') ? reaction_data.name.split('@')[1] : client.instance.host;
                post.reactions.push({
                    count: reaction_data.count,
                    emoji: parseEmoji({
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
    }
    return post;
}

export async function parseUser(data) {
    let user = new User();
    user.id = data.id;
    user.nickname = data.display_name;
    user.username = data.username;
    user.avatar_url = data.avatar;
    user.url = data.url;

    if (data.acct.includes('@'))
        user.host = data.acct.split('@')[1];
    else
        user.host = Client.get().instance.host;

    user.emojis = [];
    data.emojis.forEach(emoji_data => {
        emoji_data.id = emoji_data.shortcode + '@' + user.host;
        emoji_data.name = emoji_data.shortcode;
        emoji_data.host = user.host;
        user.emojis.push(parseEmoji(emoji_data));
    });

    Client.get().putCacheUser(user);
    return user;
}

export function parseEmoji(data) {
    let emoji = new Emoji(
        data.id,
        data.name,
        data.host,
        data.url,
    );
    Client.get().putCacheEmoji(emoji);
    return emoji;
}

export async function getUser(user_id) {
    let client = Client.get();
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
