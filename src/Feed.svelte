<script>
    import Post from './post/Post.svelte';
    import Error from './Error.svelte';
    import { Client } from './client/client.js';

    let client = Client.get();
    let posts = [];
    let loading = false;

    let error;

    async function load_posts() {
        if (loading) return; // no spamming!!
        loading = true;

        let new_posts = [];
        if (posts.length === 0) new_posts = await client.getTimeline()
        else new_posts = await client.getTimeline(posts[posts.length - 1].id);
        
        if (!new_posts) {
            console.error(`Failed to retrieve timeline posts.`);
            loading = false;
            return;
        }

        posts = [...posts, ...new_posts];

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
