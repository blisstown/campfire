<script>
    import '$lib/app.css';
    import Navigation from '$lib/ui/Navigation.svelte';
    import Widgets from '$lib/ui/Widgets.svelte';
    import { client, Client } from '$lib/client/client.js';
    import { get } from 'svelte/store';
    import { logged_in } from '$lib/stores/user.js';
    import { unread_notif_count, last_read_notif_id } from '$lib/notifications.js';

    let ready = new Promise(resolve => {
        if (get(client)) {
            if (get(client).user) logged_in.set(true);
            return resolve();
        }
        let new_client = new Client();
        new_client.load();
        client.set(new_client);

        return new_client.getClientUser().then(user => {
            if (!user) {
                client.set(new_client);
                return resolve();
            }
            if (user) logged_in.set(true);
            new_client.user = user;
            window.peekie = new_client;

            // spin up async task to fetch notifications
            get(client).getNotifications(
                get(last_read_notif_id)
            ).then(notif_data => {
                if (!notif_data) return;
                unread_notif_count.set(notif_data.length);
            });

            client.update(client => {
                client.user = user;
                return client;
            });
            return resolve();
        });
    });
</script>

<div id="app">

    <header>
        <Navigation />
    </header>

    <main>
        {#await ready}
            <div class="loading throb">
                <span>just a moment...</span>
            </div>
        {:then}
            <slot></slot>
        {/await}
    </main>

    <div id="widgets">
        <Widgets />
    </div>

</div>

<style>
    .loading {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        font-weight: bold;
    }
</style>
