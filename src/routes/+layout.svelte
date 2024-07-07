<script>
    import '$lib/app.css';
    import * as api from '$lib/api.js';
    import { server } from '$lib/client/server.js';
    import { app } from '$lib/client/app.js';
    import { account, logged_in } from '$lib/stores/account.js';
    import { parseAccount } from '$lib/account.js';
    import { unread_notif_count, last_read_notif_id } from '$lib/notifications.js';

    import Navigation from '$lib/ui/Navigation.svelte';
    import Modal from '@cf/ui/Modal.svelte';
    import Composer from '@cf/ui/Composer.svelte';
    import Widgets from '$lib/ui/Widgets.svelte';

    let show_composer = false;

    async function init() {
        if (!$app || !$app.token) {
            account.set(false);
            logged_in.set(false);
            return;
        }

        // logged in- attempt to retrieve using token
        const data = await api.verifyCredentials($server.host, $app.token);
        if (!data) return;

        account.set(parseAccount(data));
        logged_in.set(true);
        console.log(`Logged in as @${$account.username}@${$account.host}`);

        // spin up async task to fetch notifications
        const notif_data = await api.getNotifications(
            $server.host,
            $app.token,
            $last_read_notif_id
        );

        if (!notif_data) return;

        unread_notif_count.set(notif_data.length);
    };
</script>

<div id="app">
    <header>
        <Navigation on:compose={() => show_composer = true} />
    </header>

    <main>
        {#await init()}
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

    <Modal bind:visible={show_composer}>
        <Composer on:compose_finished={() => show_composer = false }/>
    </Modal>
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
