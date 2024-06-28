import { parseText as parseEmoji } from './emoji.js';

export default class Post {
    id;
    created_at;
    user;
    text;
    warning;
    boost_count;
    reply_count;
    favourite_count;
    favourited;
    boosted;
    mentions;
    reactions;
    emojis;
    files;
    url;
    reply;
    replies;
    boost;
    visibility;

    async rich_text() {
        return parseEmoji(this.text, this.user.host);
    }

    /*
    async rich_text() {
        let text = this.text;
        if (!text) return text;
        let client = Client.get();

        const markdown_tokens = [
            { tag: "pre", token: "```" },
            { tag: "code", token: "`" },
            { tag: "strong", token: "**" },
            { tag: "strong", token: "__" },
            { tag: "em", token: "*" },
            { tag: "em", token: "_" },
        ];

        let response = "";
        let md_layer;
        let index = 0;
        while (index < text.length) {
            let sample = text.substring(index);
            let md_nostack = !(md_layer && md_layer.nostack);

            // handle newlines
            if (md_nostack && sample.startsWith('\n')) {
                response += "<br>";
                index++;
                continue;
            }

            // handle mentions
            if (client.instance.capabilities.includes(capabilities.MARKDOWN_CONTENT)
                && md_nostack
                && sample.match(/^@[\w\-.]+@[\w\-.]+/g)
            ) {
                // find end of the mention
                let length = 1;
                while (index + length < text.length && /[a-z0-9-_.]/.test(text[index + length])) length++;
                length++; // skim the middle @
                while (index + length < text.length && /[a-z0-9-_.]/.test(text[index + length])) length++;

                let mention = text.substring(index, index + length);

                // attempt to resolve mention to a user
                let user = await client.getUserByMention(mention);
                if (user) {
                    const out = `<a href="/${user.mention}" class="mention">` +
                        `<img src="${user.avatar_url}" class="mention-avatar" width="20" height="20">` +
                        '@' + user.username + '@' + user.host + "</a>";
                    if (md_layer) md_layer.text += out;
                    else response += out;
                } else {
                    response += mention;
                }
                index += mention.length;
                continue;
            }

            // handle links
            if (client.instance.capabilities.includes(capabilities.MARKDOWN_CONTENT)
                && md_nostack
                && sample.match(/^[a-z]{3,6}:\/\/[^\s]+/g)
            ) {
                // get length of link
                let length = text.substring(index).search(/\s|$/g);
                let url = text.substring(index, index + length);
                let out = `<a href="${url}">${url}</a>`;
                if (md_layer) md_layer.text += out;
                else response += out;
                index += length;
                continue;
            }

            // handle emojis
            if (md_nostack && sample.match(/^:[\w\-.]{0,32}:/g)) {
                // find the emoji name
                let length = text.substring(index + 1).search(':');
                if (length <= 0) return text;
                let emoji_name = text.substring(index + 1, index + length + 1);
                let emoji = client.getEmoji(emoji_name + '@' + this.user.host);

                index += length + 2;

                if (!emoji) {
                    let out = ':' + emoji_name + ':';
                    if (md_layer) md_layer.text += out;
                    else response += out;
                    continue;
                }

                let out = emoji.html;
                if (md_layer) md_layer.text += out;
                else response += out;
                continue;
            }

            // handle markdown
            // TODO: handle misskey-flavoured markdown(?)
            if (md_layer) {
                // try to pop layer
                if (sample.startsWith(md_layer.token)) {
                    index += md_layer.token.length;
                    let out = `<${md_layer.tag}>${md_layer.text}</${md_layer.tag}>`;
                    if (md_layer.token === '```')
                        out = `<code><pre>${md_layer.text}</pre></code>`;
                    if (md_layer.parent) md_layer.parent.text += out;
                    else response += out;
                    md_layer = md_layer.parent;
                } else {
                    md_layer.text += sample[0];
                    index++;
                }
            } else if (md_nostack) {
                // should we add a layer?
                let pushed = false;
                for (let i = 0; i < markdown_tokens.length; i++) {
                    let item = markdown_tokens[i];
                    if (sample.startsWith(item.token)) {
                        let new_md_layer = {
                            token: item.token,
                            tag: item.tag,
                            text: "",
                            parent: md_layer,
                        };
                        if (item.token === '```' || item.token === '`') new_md_layer.nostack = true;
                        md_layer = new_md_layer;
                        pushed = true;
                        index += md_layer.token.length;
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
        while (md_layer) {
            let out = md_layer.token + md_layer.text;
            if (md_layer.parent) md_layer.parent.text += out;
            else response += out;
            md_layer = md_layer.parent;
        }

        return response;
    }
    */
}
