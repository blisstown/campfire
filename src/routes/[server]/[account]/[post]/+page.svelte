<script>
    import * as api from '$lib/api.js';
    import { server, createServer } from '$lib/client/server.js';
    import { app } from '$lib/client/app.js';
    import { parsePost } from '$lib/post.js';
    import { goto, afterNavigate } from '$app/navigation';
    import { base } from '$app/paths'

    import Post from '$lib/ui/post/Post.svelte';
    import Button from '$lib/ui/Button.svelte';

    export let data;

    let post;
    let error = false;
    let previous_page = base;

    if (($server && $server.host === data.server_host) && $app) {
        post = fetchPost(data.post_id, $app.token);
    } else {
        post = createServer(data.server_host).then(new_server => {
            server.set(new_server);
            if (!$server) {
                error = `Failed to connect to <code>${data.server_host}</code>.`;
                console.error(`Failed to connect to ${data.server_host}.`);
                return;
            }
            return post = fetchPost(data.post_id, null);
        });
    }

    afterNavigate(({from}) => {
        previous_page = from?.url.pathname || previous_page
    })

    async function fetchPost(post_id, token) {
        const post_data = await api.getPost($server.host, token, post_id);
        if (!post_data || post_data.error) {
            error = `Failed to retrieve post <code>${post_id}</code>.`;
            console.error(`Failed to retrieve post ${post_id}.`);
            return;
        }
        let post = await parsePost(post_data, 0);

        const post_context = await api.getPostContext($server.host, token, post_id);

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
    }
</script>

{#await post}
    <div class="loading throb">
        <span>loading post...</span>
    </div>
{:then post}
    {#if error}
        <p>{@html error}</p>
    {:else}
        <header>
            {#if previous_page}
                <nav>
                    <Button centered on:click={() => {goto(previous_page)}}>Back</Button>
                </nav>
            {/if}
            <img src={post.account.avatar_url} type={post.account.avatar_type || "image/png"} alt="" width="40" height="40" class="header-avatar" loading="lazy" decoding="async">
            <h1>
                Post by {@html post.account.rich_name}
            </h1>
        </header>
        
        <div id="feed" role="feed">
            <Post post_data={post} focused />
            <br>
            {#each post.replies as reply}
                {#await reply then reply}
                    <Post post_data={reply} />
                {/await}
            {/each}
        </div>
    {/if}
{/await}

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
        align-items: center;
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
