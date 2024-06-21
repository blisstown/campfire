<script>
    import Post from './post/Post.svelte';
    import Error from './Error.svelte';
    import { Client } from './client/client.js';
    import { parsePost } from './client/api.js';

    let client = Client.get();
    let posts = [];
    let loading = false;

    let error;

    async function load_posts() {
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
            posts = [...posts, post];
        }
        loading = false;
    }

    load_posts();
    document.addEventListener("scroll", event => {
        if (!loading && window.innerHeight + window.scrollY >= document.body.offsetHeight - 2048) {
            load_posts();
        }
    });

    /*
    client.getPost("", 1).then(post => {
        posts = [...posts, post];
        console.log(post);
    });
    */
</script>

<div id="feed">
    {#if error}
        <Error msg={error.replaceAll('\n', '<br>')} />
    {/if}
    {#if posts.length <= 0}
        <div class="loading">
            <span>just a moment...</span>
        </div>
    {/if}
    {#each posts as post}
        <Post post_data={post} />
    {/each}
</div>

<style>
    .loading {
        width: 100%;
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        font-weight: bold;
    }

    .loading span {
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        from {
            opacity: .5;
        }
        50% {
            opacity: 1;
        }
        to {
            opacity: .5;
        }
    }
</style>
