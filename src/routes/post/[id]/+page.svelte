<script>
    import '$lib/app.css';
    import Post from '$lib/ui/post/Post.svelte';
    import Button from '$lib/ui/Button.svelte';

    export let data;
    $: main_post = data.posts[0];
    $: replies = data.posts.slice(1);
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
    {#if data.posts.length <= 0}
        <div class="throb">
            <span>just a moment...</span>
        </div>
    {:else}
        {#key data}
        <Post post_data={main_post} focused />
        <br>
        {#each replies as post}
            <Post post_data={post} />
        {/each}
        {/key}
    {/if}
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
