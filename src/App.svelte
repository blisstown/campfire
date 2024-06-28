<script>
    import Navigation from './ui/Navigation.svelte';
    import Widgets from './ui/Widgets.svelte';
    import Feed from './ui/Feed.svelte';
    import { Client } from './client/client.js';
    import Button from './ui/Button.svelte';
    import { get } from 'svelte/store';

    let client = get(Client.get());
    let ready = client.app && client.app.token;
    let instance_url_error = false;
    let logging_in = false;

    let auth_code = new URLSearchParams(location.search).get("code");
    if (auth_code) {
        client.getToken(auth_code).then(() => {
            client.save();
            location = location.origin;
        });
    }

    if (client.app && client.app.token) {
        client.verifyCredentials().then(res => {
            if (res) {
                console.log(`Logged in as @${client.user.username}@${client.user.host}`);
            }
        });
    }

    function log_in(event) {
        logging_in = true;
        event.preventDefault();
        const host = event.target.host.value;

        client.init(host).then(res => {
            logging_in = false;
            if (!res) return;
            if (res.constructor === String) {
                instance_url_error = res;
                return;
            };
            let oauth_url = client.getOAuthUrl();
            location = oauth_url;
        });
    }
</script>

<div id="spacesocial-app">

    <header>
        <Navigation />
    </header>

    <main>
        {#if ready}
            <Feed />
        {:else}
            <div>
                <form on:submit={log_in} id="login">
                    <h1>Space Social</h1>
                    <p>Welcome, fediverse user!</p>
                    <p>Please enter your instance domain to log in.</p>
                    <div class="input-wrapper">
                        <input type="text" id="host" aria-label="instance domain" class={logging_in ? "throb" : ""}>
                        {#if instance_url_error}
                            <p class="error">{instance_url_error}</p>
                        {/if}
                    </div>
                    <br>
                    <button type="submit" id="login" class={logging_in ? "disabled" : ""}>Log in</button>
                    <p><small>
                        Please note this is
                        <strong><em>extremely experimental software</em></strong>;
                        things are likely to break!
                        <br>
                        If that's all cool with you, welcome aboard!
                    </small></p>

                    <p class="form-footer">made with ❤️ by <a href="https://arimelody.me">ari melody</a>, 2024</p>
                </form>
            </div>
        {/if}
    </main>

    <div id="widgets">
        <Widgets />
    </div>

</div>

<style>
    #spacesocial-app {
        margin: auto 0;
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 16px;
    }

    header, #widgets {
        width: 300px;
    }

    main {
        width: 732px;
    }

    div.pane {
        margin-top: 16px;
        padding: 20px 32px;
        border: 1px solid #8884;
        border-radius: 16px;
        background-color: var(--bg1);
    }

    form#login {
        margin: 25vh 0 32px 0;
        text-align: center;
    }

    a {
        color: var(--accent);
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    .input-wrapper {
        width: 360px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    input[type=text] {
        width: 100%;
        padding: 12px;
        display: block;
        border-radius: 8px;
        border: 1px solid var(--accent);
        background-color: var(--bg-800);

        font-family: inherit;
        font-weight: bold;
        font-size: inherit;
        color: var(--text);

        transition: box-shadow .2s;
    }

    input[type=text]::placeholder {
        opacity: .8;
    }

    input[type=text]:focus {
        outline: none;
        box-shadow: 0 0 16px color-mix(in srgb, transparent, var(--accent) 25%);
    }

    .error {
        margin: 6px;
        font-style: italic;
        font-size: .9em;
        color: red;
        opacity: .7;
    }

    button#login {
        margin: -8px auto 0 auto;
        padding: 12px 24px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        font-family: inherit;
        font-size: 1rem;
        font-weight: 600;
        text-align: left;

        border-radius: 8px;
        border-width: 2px;
        border-style: solid;

        background-color: var(--bg-700);
        color: var(--text);
        border-color: transparent;

        transition-property: border-color, background-color, color;
        transition-timing-function: ease-out;
        transition-duration: .1s;

        cursor: pointer;
        text-align: center;
        justify-content: center;
    }

    button#login:hover {
        background-color: color-mix(in srgb, var(--bg-700), var(--accent) 10%);
        border-color: color-mix(in srgb, var(--bg-700), var(--accent) 20%);
    }

    button#login:active {
        background-color: color-mix(in srgb, var(--bg-700), var(--bg-800) 50%);
        border-color: color-mix(in srgb, var(--bg-700), var(--bg-800) 10%);
    }

    button#login.disabled {
        opacity: .5;
        cursor: initial;
    }

    .form-footer {
        opacity: .7;
    }
</style>
