<script>
    import Feed from './Feed.svelte';
    import { Client, server_types } from './client/client.js';

    let ready = Client.get().app && Client.get().app.token;

    let auth_code = new URLSearchParams(location.search).get("code");
    if (auth_code) {
        let client = Client.get();
        client.getToken(auth_code).then(() => {
            client.save();
            location = location.origin;
        });
    }

    function log_in(event) {
        let client = Client.get();
        event.preventDefault();
        const host = event.target.host.value;

        client.init(host).then(() => {
            if (client.instance.type === server_types.INCOMPATIBLE) {
                console.error("Server " + client.instance.host + " is not supported - " + client.instance.version);
                alert("Sorry, this app is not compatible with " + client.instance.host + "!");
                return;
            }
            console.log("Server is \"" + client.instance.type + "\" (or compatible).");
            client.save();
            let oauth_url = client.getOAuthUrl();
            location = oauth_url;
        });
    }


    function log_out() {
        Client.get().logout().then(() => {
            ready = false;
        });
    }
</script>

<header>
    <h1>space social</h1>
    <p>social media for the galaxy-wide-web! 🌌</p>
    <button id="logout" on:click={log_out}>log out</button>
</header>

<main>
    {#if ready}
        <Feed />
    {:else}
        <div class="pane">
            <form on:submit={log_in} id="login">
                <h1>welcome!</h1>
                <p>please enter your instance domain to log in.</p>
                <input type="text" id="host" aria-label="instance domain">
                <button type="submit" id="login">log in</button>
            </form>

            <hr>

            <p><small>
                please note this is <strong><em>extremely experimental software</em></strong>;
                even if you use the exact same instance as me, you may encounter problems.
                if that's all cool with you, welcome aboard!
            </small></p>

            <p>made with ❤️ by <a href="https://arimelody.me">ari melody</a>, 2024</p>
        </div>
    {/if}
</main>

<footer>
</footer>

<style>
    header {
        width: min(768px, calc(100vw - 32px));
        margin: 16px auto;
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    header h1 {
        margin: 0 16px 0 0;
    }

    h1 {
        color: var(--accent);
    }

    main {
        width: min(800px, calc(100vw - 16px));
        margin: 0 auto;
    }

    div.pane {
        margin-top: 16px;
        padding: 20px 32px;
        border: 1px solid #8884;
        border-radius: 16px;
        background-color: var(--bg1);
    }

    form#login {
        margin: 64px 0;
        text-align: center;
    }

    a {
        color: var(--accent);
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    input[type="text"], input[type="password"] {
        margin: 8px 0;
        padding: 4px 6px;
        font-family: inherit;
        border: none;
        border-radius: 8px;
    }

    button#login, button#logout {
        margin-left: auto;
        padding: 8px 12px;
        font-size: 1em;
        background-color: var(--bg2);
        color: inherit;
        border: none;
        border-radius: 16px;
        cursor: pointer;
        transition: color .1s, background-color .1s;
    }

    button#login:hover, button#logout:hover {
        color: var(--bg0);
        background: var(--fg0);
    }

    button#login:active, button#logout:active {
        background: #0001;
    }

    code {
        font-size: 1.2em;
    }
</style>
