import Post from '$lib/ui/post/Post.svelte';
import { Client } from '$lib/client/client.js';
import { parsePost } from '$lib/client/api.js';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

export const ssr = false;

export async function load({ params }) {
    let client = get(Client.get());

    if (!client.instance || !client.user) {
        goto("/");
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
