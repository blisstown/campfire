<script>
    import { notifications, getNotifications } from '$lib/notifications.js';
    import { logged_in } from '$lib/stores/user.js';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
    import Notification from '$lib/ui/Notification.svelte';

    if (!get(logged_in)) goto("/");

    getNotifications();
    /*
    document.addEventListener("scroll", event => {
        if (get(logged_in) && get(page).url.pathname !== "/") return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2048) {
            getNotifications();
        }
    });
    */
</script>

<header>
    <h1>Notifications</h1>
</header>

<div class="notifications">
    {#if $notifications.length === 0}
        <div class="loading throb">
            <span>fetching notifications...</span>
        </div>
    {:else}
        {#each $notifications as notif}
            <Notification data={notif} />
        {/each}
    {/if}
</div>

<style>
    header {
        width: 100%;
        height: 64px;
        margin: 16px 0 8px 0;
        display: flex;
        flex-direction: row;
    }

    h1 {
        font-size: 1.5em;
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
