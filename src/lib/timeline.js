import { client } from '$lib/client/client.js';
import { get, writable } from 'svelte/store';
import { parsePost } from '$lib/client/api.js';

export let posts = writable([]);

let loading = false;

export async function getTimeline(clean) {
    if (loading) return; // no spamming!!
    loading = true;

    let timeline_data;
    if (clean || get(posts).length === 0) timeline_data = await get(client).getTimeline()
    else timeline_data = await get(client).getTimeline(get(posts)[get(posts).length - 1].id);

    if (!timeline_data) {
        console.error(`Failed to retrieve timeline.`);
        loading = false;
        return;
    }

    if (clean) posts.set([]);

    for (let i in timeline_data) {
        const post_data = timeline_data[i];
        const post = await parsePost(post_data, 1, false);
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
        posts.update(current => [...current, post]);
    }
    loading = false;
}
