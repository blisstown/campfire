<script>
    import Feed from './Feed.svelte';
    import Error from './Error.svelte';
    import Instance from './instance.js';

    let ready = false;
    if (localStorage.getItem("fedi_host") && localStorage.getItem("fedi_token")) {
        Instance.setup(
            localStorage.getItem("fedi_host"),
            localStorage.getItem("fedi_token"),
            true
        ).then(() => {
            ready = true;
        });
    }

    function log_in(event) {
        event.preventDefault();
        localStorage.setItem("fedi_host", event.target.instance_host.value);
        localStorage.setItem("fedi_token", event.target.session_token.value);
        location = location;
    }

    function log_out() {
        localStorage.removeItem("fedi_host");
        localStorage.removeItem("fedi_token");
        location = location;
    }
</script>

<header>
    <h1>space social</h1>
    <p>social media for the galaxy-wide-web! 🌌</p>
    <button id="log-out" on:click={log_out}>log out</button>
</header>

<main>
    {#if ready}
        <Feed />
    {:else if !Instance.get_instance().ok}
        <Error>
            <p>this app requires a <strong>instance host</strong> and <strong>session token</strong> to work! you may enter these below:</p>

            <form on:submit={data => (log_in(data))}>
                <label for="instance host">instance host: </label>
                <input type="text" id="instance_host">
                <br>
                <label for="session token">session token: </label>
                <input type="password" id="session_token">
                <br>
                <button type="submit" id="log-in">log in</button>
            </form>

            <hr>

            <h4>how do i get these?</h4>
            <ul>
                <li>
                    <strong>instance host</strong> refers to the domain of your fediverse instance. i.e. <code>ice.arimelody.me</code>.
                </li>
                <li>
                    a <strong>token</strong> is a unique code that grants applications permission to act on your behalf.
                    you can find it in your browser's cookies for your instance.
                    (instructions for <a href="https://support.mozilla.org/en-US/questions/1219653">firefox</a>
                    and <a href="https://superuser.com/questions/1715037/how-can-i-view-the-content-of-cookies-in-chrome">chrome</a>)
                </li>
            </ul>

            <p><small>
                your login credentials will not be saved to an external server.
                they are required for communication with the fediverse instance, and are saved entirely within your browser.
                a cleaner login flow will be built in the future.
            </small></p>
            <p><small>
                oh yeah i should also probably mention this is <strong><em>extremely experimental software</em></strong>;
                even if you use the exact same instance as me, you may encounter problems.
                if that's all cool with you, welcome aboard!
            </small></p>

            <p>made with ❤️ by <a href="https://arimelody.me">ari melody</a>, 2024</p>
        </Error>
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

    h1 {
        color: var(--accent);
        margin: 0 16px 0 0;
    }

    main {
        width: min(800px, calc(100vw - 16px));
        margin: 0 auto;
    }

    a {
        color: var(--accent);
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    input[type="text"], input[type="password"] {
        margin-bottom: 8px;
        padding: 4px 6px;
        font-family: inherit;
        border: none;
        border-radius: 8px;
    }

    button#log-in, button#log-out {
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

    button#log-in.active, button#log-out.active {
        background: var(--accent);
        color: var(--bg0);
    }

    button#log-in:hover, button#log-out:hover {
        color: var(--bg0);
        background: var(--fg0);
    }

    button#log-in:active, button#log-out:active {
        background: #0001;
    }

    code {
        font-size: 1.2em;
    }
</style>
