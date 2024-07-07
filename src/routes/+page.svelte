<script>
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import { logged_in } from '$lib/stores/account.js';
    import { timeline, getTimeline } from '$lib/timeline.js';

    import LoginForm from '$lib/ui/LoginForm.svelte';
    import Button from '$lib/ui/Button.svelte';
    import Post from '$lib/ui/post/Post.svelte';

    logged_in.subscribe(logged_in => {
        if (logged_in) getTimeline();
    });

    document.addEventListener("scroll", () => {
        if (get(logged_in) && get(page).url.pathname !== "/") return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2048) {
            getTimeline();
        }
    });
</script>

{#if $logged_in}
    <header>
        <h1>Home</h1>
        <nav>
            <Button centered active>Home</Button>
                <Button centered disabled>Local</Button>
                <Button centered disabled>Federated</Button>
        </nav>
    </header>

    <div id="feed" role="feed">
        {#if $timeline.length <= 0}
            <div class="loading throb">
                <span>getting the feed...</span>
            </div>
        {/if}
        {#each $timeline as post}
            <Post post_data={post} />
        {/each}
    </div>
{:else}
    <LoginForm />
{/if}

<style>
    header {
        width: 100%;
        height: 64px;
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
