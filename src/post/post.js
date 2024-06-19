import { Client, server_types } from '../client/client.js';
import { parseOne as parseEmoji, EMOJI_REGEX } from '../emoji.js';

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

    async rich_text() {
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
            // TODO: setup a better system for handling different server capabilities
            if (Client.get().instance.type !== server_types.MASTODON && allow_new && sample.match(/^@[\w\-.]+@[\w\-.]+/g)) {
                // find end of the mention
                let length = 1;
                while (index + length < text.length && /[a-z0-9-_.]/.test(text[index + length])) length++;
                length++; // skim the middle @
                while (index + length < text.length && /[a-z0-9-_.]/.test(text[index + length])) length++;

                let mention = text.substring(index, index + length);

                // attempt to resolve mention to a user
                let user = await Client.get().getUserByMention(mention);
                if (user) {
                    const out = `<a href="/${user.mention}" class="mention">` +
                        `<img src="${user.avatar_url}" class="mention-avatar" width="20" height="20">` +
                        '@' + user.username + '@' + user.host + "</a>";
                    if (current) current.text += out;
                    else response += out;
                } else {
                    response += mention;
                }
                index += mention.length;
                continue;
            }

            // handle links
            if (Client.get().instance.type !== server_types.MASTODON && allow_new && sample.match(/^[a-z]{3,6}:\/\/[^\s]+/g)) {
                // get length of link
                let length = text.substring(index).search(/\s|$/g);
                let url = text.substring(index, index + length);
                let out = `<a href="${url}">${url}</a>`;
                if (current) current.text += out;
                else response += out;
                index += length;
                continue;
            }

            // handle emojis
            if (allow_new && sample.match(/^:[\w\-.]{0,32}:/g)) {
                // find the emoji name
                let length = text.substring(index + 1).search(':');
                if (length <= 0) return text;
                let emoji_name = text.substring(index + 1, index + length + 1);
                let emoji = Client.get().getEmoji(emoji_name + '@' + this.user.host);

                index += length + 2;

                if (!emoji) {
                    let out = ':' + emoji_name + ':';
                    if (current) current.text += out;
                    else response += out;
                    continue;
                }

                let out = emoji.html;
                if (current) current.text += out;
                else response += out;
                continue;
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
