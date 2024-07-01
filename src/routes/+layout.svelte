<script>
    import '$lib/app.css';
    import Navigation from '$lib/ui/Navigation.svelte';
    import Widgets from '$lib/ui/Widgets.svelte';
    import { client, Client } from '$lib/client/client.js';
    import { get } from 'svelte/store';

    let ready = new Promise(resolve => {
        if (get(client)) {
            return resolve();
        }
        let new_client = new Client();
        new_client.load();

        return new_client.getClientUser().then(user => {
            if (!user) {
                client.set(new_client);
                return resolve();
            }
            new_client.user = user;
            client.set(new_client);
            client.user
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
