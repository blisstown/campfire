<script>
    import '$lib/app.css';
    import Post from '$lib/ui/post/Post.svelte';

    export let data;
    $: main_post = data.posts[0];
    $: replies = data.posts.slice(1);
</script>

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
