<script>
    import Button from './Button.svelte';
    import Post from './post/Post.svelte';
    import Error from './Error.svelte';
    import { Client } from '../client/client.js';
    import { parsePost } from '../client/api.js';
    import { get } from 'svelte/store';

    let params = new URLSearchParams(location.search);

    let client = get(Client.get());
    let posts = [];
    let loading = false;
    let focus_post_id = location.pathname.startsWith("/post/") ? location.pathname.substring(6) : false;

    let error;

    async function getTimeline() {
        if (loading) return; // no spamming!!
        loading = true;

        let timeline_data;
        if (posts.length === 0) timeline_data = await client.getTimeline()
        else timeline_data = await client.getTimeline(posts[posts.length - 1].id);

        if (!timeline_data) {
            console.error(`Failed to retrieve timeline.`);
            loading = false;
            return;
        }

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
            posts = [...posts, post];
        }
        loading = false;
    }

    async function getPost(post_id) {
        loading = true;

        const post_data = await client.getPost(post_id);
        if (!post_data) {
            console.error(`Failed to retrieve post ${post_id}.`);
            loading = false;
            return;
        }

        const post = await parsePost(post_data, 10, true);
        posts = [post];
        for (let i in post.replies) {
            posts = [...posts, post.replies[i]];
        }
        loading = false;
    }

    if (focus_post_id) {
        getPost(focus_post_id);
    } else {
        getTimeline();
        document.addEventListener("scroll", event => {
            if (!loading && window.innerHeight + window.scrollY >= document.body.offsetHeight - 2048) {
                getTimeline();
            }
        });
    }
</script>

<header>
    <h1>Home</h1>
    <nav>
        <Button centered active>Home</Button>
        <Button centered disabled>Local</Button>
        <Button centered disabled>Federated</Button>
    </nav>
</header>

<div id="feed">
    {#if posts.length <= 0}
        <div class="throb">
            <span>just a moment...</span>
        </div>
    {/if}
    {#each posts as post}
        <Post post_data={post} focused={post.id === focus_post_id} />
    {/each}
</div>

<style>
    header {
        margin: 16px 0 8px 0;
        display: flex;
        flex-direction: row;
    }

    header h1 {
        font-size: 1.5em;
    }

    nav {
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
