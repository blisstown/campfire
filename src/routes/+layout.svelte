<script>
    import '$lib/app.css';
    import Navigation from '$lib/ui/Navigation.svelte';
    import Widgets from '$lib/ui/Widgets.svelte';
    import { Client } from '$lib/client/client.js';
    import { get } from 'svelte/store';

    let client = get(Client.get());
</script>

<div id="app">

    <header>
        <Navigation />
    </header>

    <main>
        {#await client.verifyCredentials()}
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
