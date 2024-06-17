import Instance from '../instance.js';
import User from '../user/user.js';

import { parse_one as parse_emoji } from '../emoji.js';

let post_cache = Object;

export default class Post {
    id;
    created_at;
    user;
    text;
    warning;
    boost_count;
    reply_count;
    mentions;
    reactions;
    emojis;
    files;
    url;
    reply;
    boost;

    static resolve_id(id) {
        return post_cache[id] || null;
    }

    static parse(data) {
        const instance = Instance.get_instance();
        let post = null;
        switch (instance.type) {
            case Instance.types.ICESHRIMP:
                post = Post.#parse_iceshrimp(data);
                break;
            case Instance.types.MASTODON:
                post = Post.#parse_mastodon(data);
                break;
            default:
                break;
        }
        if (!post) {
            console.error("Error while parsing post data");
            return null;
        }
        post_cache[post.id] = post;
        return post;
    }

    static #parse_iceshrimp(data) {
        let post = new Post()
        post.id = data.id;
        post.created_at = new Date(data.createdAt);
        post.user = User.parse(data.user);
        post.text = data.text;
        post.warning = data.cw;
        post.boost_count = data.renoteCount;
        post.reply_count = data.repliesCount;
        post.mentions = data.mentions;
        post.reactions = data.reactions;
        post.emojis = data.emojis;
        post.files = data.files;
        post.url = data.url;
        post.boost = data.renote ? Post.parse(data.renote) : null;
        post.reply = data.reply ? Post.parse(data.reply) : null;
        return post;
    }

    static #parse_mastodon(data) {
        let post = new Post()
        post.id = data.id;
        post.created_at = new Date(data.created_at);
        post.user = User.parse(data.account);
        post.text = data.content;
        post.warning = data.spoiler_text;
        post.boost_count = data.reblogs_count;
        post.reply_count = data.replies_count;
        post.mentions = data.mentions;
        post.reactions = data.reactions;
        post.emojis = data.emojis;
        post.files = data.media_attachments;
        post.url = data.url;
        post.boost = data.reblog ? Post.parse(data.reblog) : null;
        post.reply = data.in_reply_to_id ? Post.resolve_id(data.in_reply_to_id) : null;
        return post;
    }

    get rich_text() {
        let text = this.text;
        if (!text) return text;

        const markdown_tokens = [
            { tag: "pre", token: "```" },
            { tag: "code", token: "`" },
            { tag: "strong", token: "**", regex: /\*{2}/g },
            { tag: "strong", token: "__" },
            { tag: "em", token: "*", regex: /\*/g },
            { tag: "em", token: "_" },
        ];

        let response = "";
        let current;
        let index = 0;
        while (index < text.length) {
            let sample = text.substring(index);
            let allow_new = !current || !current.nostack;

            // handle newlines
            if (allow_new && sample.startsWith('\n')) {
                response += "<br>";
                index++;
                continue;
            }

            // handle mentions
            if (allow_new && sample.match(/@[a-z0-9-_.]+@[a-z0-9-_.]+/g)) {
                // find end of the mention
                let length = 1;
                while (index + length < text.length && /[a-z0-9-_.]/.test(text[index + length])) length++;
                length++; // skim the middle @
                while (index + length < text.length && /[a-z0-9-_.]/.test(text[index + length])) length++;

                let mention = text.substring(index, index + length);

                // attempt to resolve mention to a user
                let user = User.resolve_mention(mention);
                if (user) {
                    const out = `<a href="/${user.mention}" class="mention">` +
                        `<img src="${user.avatar_url}" class="mention-avatar" width="20" height="20">` +
                        "@" + user.name + "</a>";
                    if (current) current.text += out;
                    else response += out;
                } else {
                    response += mention;
                }
                index += mention.length;
                continue;
            }

            if (Instance.get_instance().type !== Instance.types.MASTODON) {
                // handle links
                if (allow_new && sample.match(/^[a-z]{3,6}:\/\/[^\s]+/g)) {
                    // get length of link
                    let length = text.substring(index).search(/\s|$/g);
                    let url = text.substring(index, index + length);
                    let out = `<a href="${url}">${url}</a>`;
                    if (current) current.text += out;
                    else response += out;
                    index += length;
                    continue;
                }
            }

            // handle emojis
            if (allow_new && sample.startsWith(':')) {
                // lookahead to next invalid emoji character
                let look = sample.substring(1).search(/[^a-zA-Z0-9-_.]/g) + 1;
                // if it's ':', we can parse it
                if (look !== 0 && sample[look] === ':') {
                    let emoji_code = sample.substring(0, look + 1);
                    let out = parse_emoji(emoji_code, this.emojis);
                    if (current) current.text += out;
                    else response += out;
                    index += emoji_code.length;
                    continue;
                }
            }

            // handle markdown
            // TODO: handle misskey-flavoured markdown
            if (current) {
                // try to pop stack
                if (sample.startsWith(current.token)) {
                    index += current.token.length;
                    let out = `<${current.tag}>${current.text}</${current.tag}>`;
                    if (current.token === '```')
                        out = `<code><pre>${current.text}</pre></code>`;
                    if (current.parent) current.parent.text += out;
                    else response += out;
                    current = current.parent;
                } else {
                    current.text += sample[0];
                    index++;
                }
            } else if (allow_new) {
                // can we add to stack?
                let pushed = false;
                for (let i = 0; i < markdown_tokens.length; i++) {
                    let item = markdown_tokens[i];
                    if (sample.startsWith(item.token)) {
                        let new_current = {
                            token: item.token,
                            tag: item.tag,
                            text: "",
                            parent: current,
                        };
                        if (item.token === '```' || item.token === '`') new_current.nostack = true;
                        current = new_current;
                        pushed = true;
                        index += current.token.length;
                        break;
                    }
                }
                if (!pushed) {
                    response += sample[0];
                    index++;
                }
            }
        }

        // destroy the remaining stack
        while (current) {
            let out = current.token + current.text;
            if (current.parent) current.parent.text += out;
            else response += out;
            current = current.parent;
        }

        return response;
    }
}
