import * as api from '$lib/api.js';
import { server } from '$lib/client/server.js';
import { app } from '$lib/client/app.js';
import { get, writable } from 'svelte/store';
import { parsePost } from '$lib/post.js';

export const timeline = writable([]);

let loading = false;

export async function getTimeline(clean) {
    if (loading) return; // no spamming!!
    loading = true;

    let last_post = false;
    if (!clean && get(timeline).length > 0)
        last_post = get(timeline)[get(timeline).length - 1].id;

    const timeline_data = await api.getTimeline(
        get(server).host,
        get(app).token,
        "home",
        last_post
    );

    if (!timeline_data) {
        console.error(`Failed to retrieve timeline.`);
        loading = false;
        return;
    }

    if (clean) timeline.set([]);

    for (let i in timeline_data) {
        const post_data = timeline_data[i];
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
        timeline.update(current => [...current, post]);
    }
    loading = false;
}
