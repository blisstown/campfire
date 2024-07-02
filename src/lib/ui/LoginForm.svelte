<script>
    import { client } from '$lib/client/client.js';
    import { get } from 'svelte/store';

    import Logo from '$lib/../img/campfire-logo.svg';

    let instance_url_error = false;
    let logging_in = false;

    function log_in(event) {
        event.preventDefault();
        instance_url_error = false;

        logging_in = true;
        const host = event.target.host.value;

        if (!host || host === "") {
            instance_url_error = "Please enter an instance domain.";
            logging_in = false;
            return;
        }

        console.log(client);

        get(client).init(host).then(res => {
            logging_in = false;
            if (!res) return;
            if (res.constructor === String) {
                instance_url_error = res;
                return;
            };
            let oauth_url = get(client).getOAuthUrl();
            location = oauth_url;
        });
    }
</script>

<form on:submit={log_in} id="login-form">
    <div class="app-logo">
        <Logo />
    </div>
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

    <p class="form-footer">made with ❤ by <a href="https://bliss.town">bliss town</a>, 2024</p>
</form>

<style>
    form#login-form {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
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
        margin: 8px auto;
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
