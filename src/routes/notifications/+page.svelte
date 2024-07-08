<script>
    import { notifications, last_read_notif_id, unread_notif_count, getNotifications } from '$lib/notifications.js';
    import { account } from '$lib/stores/account.js';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Notification from '$lib/ui/Notification.svelte';

    if (!$account) goto("/");

    getNotifications().then(notif_data => {
        if (notif_data && notif_data.constructor === Array) {
            last_read_notif_id.set(notif_data[0].id);
        }
        unread_notif_count.set(0);
    });
    document.addEventListener("scroll", () => {
        if ($account && $page.url.pathname !== "/notifications") return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2048) {
            let max_id = $notifications.length > 0 ? $notifications[$notifications.length - 1].id : null;
            getNotifications(null, max_id);
        }
    });
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
