<script>
    import { client } from '$lib/client/client.js';

    import LoginForm from '$lib/ui/LoginForm.svelte';
    import Feed from '$lib/ui/Feed.svelte';
    import User from '$lib/user/user.js';
    import Button from '$lib/ui/Button.svelte';
</script>

{#if $client.user}
    <Feed />
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
