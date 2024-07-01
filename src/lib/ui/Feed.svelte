<script>
    import Button from './Button.svelte';
    import Post from './post/Post.svelte';
    import { posts, getTimeline } from '$lib/timeline.js';

    getTimeline();
    document.addEventListener("scroll", event => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2048) {
            getTimeline();
        }
    });
</script>

<header>
    <h1>Home</h1>
    <nav>
        <Button centered active>Home</Button>
        <Button centered disabled>Local</Button>
        <Button centered disabled>Federated</Button>
    </nav>
</header>

<div id="feed" role="feed">
    {#if posts.length <= 0}
        <div class="loading throb">
            <span>getting the feed...</span>
        </div>
    {/if}
    {#each $posts as post}
        <Post post_data={post} />
    {/each}
</div>

<style>
    header {
        width: 100%;
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
