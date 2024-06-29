import Post from '$lib/ui/post/Post.svelte';
import { Client } from '$lib/client/client.js';
import { parsePost } from '$lib/client/api.js';
import { get } from 'svelte/store';

export const prerender = true;
export const ssr = false;

export async function load({ params }) {
    let client = get(Client.get());
    if (client.app && client.app.token) {
        // this triggers the client actually getting the authenticated user's data.
        const res = await client.verifyCredentials()
        if (res) {
            console.log(`Logged in as @${client.user.username}@${client.user.host}`);
        } else {
            return null;
        }
    } else {
        return null;
    }

    const post_id = params.id;

    const post_data = await client.getPost(post_id);
    if (!post_data) {
        console.error(`Failed to retrieve post ${post_id}.`);
        return null;
    }

    const post = await parsePost(post_data, 10, true);
    let posts = [post];
    for (let i in post.replies) {
        const reply = post.replies[i];
        // if (i > 1 && reply.reply_id === post.replies[i - 1].id) {
        //     let reply_head = posts.pop();
        //     reply.reply = reply_head;
        // }
        posts.push(reply);
        // console.log(reply);
    }

    return {
        posts: posts
    };
}
