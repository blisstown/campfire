<script>
    import { notifications, getNotifications } from '$lib/notifications.js';
    import Notification from '$lib/ui/Notification.svelte';

    getNotifications();
    /*
    document.addEventListener("scroll", event => {
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

    .notifications {
        margin: 16px 0;
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
