<script>
    import { client } from '$lib/client/client.js';
    import * as api from '$lib/client/api.js';
    import { get } from 'svelte/store';

    import Post from '$lib/ui/post/Post.svelte';
    import Button from '$lib/ui/Button.svelte';

    export let data;
    let error = false;

    if (!get(client).instance || !get(client).user) {
        goto("/");
    }

    $: post = (async resolve => {
        const post_data = await get(client).getPost(data.post_id, 0, false);
        if (!post_data) {
            error = `Failed to retrieve post <code>${data.post_id}</code>.`;
            console.error(`Failed to retrieve post ${data.post_id}.`);
            return;
        }
        let post = await api.parsePost(post_data, 0, false);

        const post_context = await get(client).getPostContext(data.post_id);

        if (!post_context || !post_context.ancestors || !post_context.descendants)
            return post;

        // handle ancestors (above post)
        let thread_top = post;
        while (post_context.ancestors.length > 0) {
            thread_top.reply = await api.parsePost(post_context.ancestors.pop(), 0, false);
            thread_top = thread_top.reply;
        }

        // handle descendants (below post)
        post.replies = [];
        for (let i in post_context.descendants) {
            post.replies.push(
                api.parsePost(post_context.descendants[i], 0, false)
            );
        }

        return post;
    })();
</script>

{#if !error}
<header>
    {#await post then post}
        <h1>Post by {@html post.user.rich_name}</h1>
    {/await}
    <nav>
        <Button centered>Back</Button>
    </nav>
</header>

<div id="feed" role="feed">
    {#await post}
        <div class="throb">
            <span>loading post...</span>
        </div>
    {:then post}
        <Post post_data={post} focused />
        <br>
        {#each post.replies as reply}
            {#await reply then reply}
                <Post post_data={reply} />
            {/await}
        {/each}
    {/await}
</div>
{:else}
    <p>{@html error}</p>
{/if}

<style>
    header {
        width: 100%;
        margin: 16px 0 8px 0;
        display: flex;
        flex-direction: row;
    }

    header h1 {
        margin: auto auto auto 8px;
        font-size: 1.5em;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    header nav {
        margin-left: auto;
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    #feed {
        margin-bottom: 20vh;
    }

    .throb {
        width: 100%;
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        font-weight: bold;
    }
</style>
