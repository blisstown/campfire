<script>
    import Post from './post/Post.svelte';
    import Error from './Error.svelte';
    import Instance from './instance.js';

    let posts = [];
    let loading = false;

    let error;

    async function load_posts() {
        if (loading) return; // no spamming!!
        loading = true;

        let new_posts = [];
        if (posts.length === 0) new_posts = await Instance.get_timeline()
        else new_posts = await Instance.get_timeline(posts[posts.length - 1].id);
        
        if (!new_posts) {
            error = `sorry! the frontend is unable to communicate with your server.

this app is still in very early development, and is currently only built to support iceshrimp.

for more information, please consult the developer console.`;
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
</script>

<div id="feed">
    {#if error}
        <Error msg={error.replaceAll('\n', '<br>')} />
    {/if}
    {#each posts as post}
        <Post post={post} />
    {/each}
</div>
