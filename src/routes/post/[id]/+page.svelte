<script>
    import * as api from '$lib/api.js';
    import { logged_in } from '$lib/stores/account.js';
    import { server } from '$lib/client/server.js';
    import { app } from '$lib/client/app.js';
    import { parsePost } from '$lib/post.js';
    import { get } from 'svelte/store';
    import { goto, afterNavigate } from '$app/navigation';
    import { base } from '$app/paths'

    import Post from '$lib/ui/post/Post.svelte';
    import Button from '$lib/ui/Button.svelte';

    export let data;
    let error = false;

    if (!get(logged_in)) goto("/");

    let previous_page = base;

    afterNavigate(({from}) => {
        previous_page = from?.url.pathname || previous_page
    })

    $: post = (async resolve => {
        const post_data = await api.getPost(get(server).host, get(app).token, data.post_id);
        if (!post_data) {
            error = `Failed to retrieve post <code>${data.post_id}</code>.`;
            console.error(`Failed to retrieve post ${data.post_id}.`);
            return;
        }
        let post = await parsePost(post_data, 0);

        const post_context = await api.getPostContext(get(server).host, get(app).token, data.post_id);

        if (!post_context || !post_context.ancestors || !post_context.descendants)
            return post;

        // handle ancestors (above post)
        let thread_top = post;
        while (post_context.ancestors.length > 0) {
            thread_top.reply = await parsePost(post_context.ancestors.pop(), 0);
            thread_top = thread_top.reply;
        }

        // handle descendants (below post)
        post.replies = [];
        for (let i in post_context.descendants) {
            post.replies.push(parsePost(post_context.descendants[i], 0));
        }

        return post;
    })();
</script>

{#if !error}
<header>
    {#await post then post}
        <nav>
            <Button centered on:click={() => {goto(previous_page)}}>Back</Button>
        </nav>
        <img src={post.account.avatar_url} type={post.account.avatar_type} alt="" width="40" height="40" class="header-avatar" loading="lazy" decoding="async">
        <h1>
            Post by {@html post.account.rich_name}
        </h1>
    {/await}
</header>

<div id="feed" role="feed">
    {#await post}
        <div class="loading throb">
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
        height: 64px;
        margin: 16px 0 8px 0;
        display: flex;
        flex-direction: row;
    }

    header .header-avatar {
        width: 40px;
        height: 40px;
        margin: auto 0;
        border-radius: 4px;
    }

    header h1 {
        margin: auto auto auto 8px;
        font-size: 1.5em;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    header nav {
        margin-right: 8px;
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    #feed {
        margin-bottom: 20vh;
    }

    .loading {
        width: 100%;
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        font-weight: bold;
    }
</style>
