<script>
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import { client } from '$lib/client/client.js';
    import { timeline, getTimeline } from '$lib/timeline.js';

    import LoginForm from '$lib/ui/LoginForm.svelte';
    import Feed from '$lib/ui/Feed.svelte';
    import User from '$lib/user/user.js';
    import Button from '$lib/ui/Button.svelte';

    getTimeline();
    document.addEventListener("scroll", event => {
        if (get(page).url.pathname !== "/") return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2048) {
            getTimeline();
        }
    });
</script>

{#if $client.user}
    <Feed posts={$timeline} />
{:else}
    <LoginForm />
{/if}

<style>
    a {
        color: var(--accent);
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

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

    :global(.app-logo) {
        height: auto;
        width: 320px;
        margin: 8px;
    }
</style>
