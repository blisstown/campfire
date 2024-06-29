<script>
    import LogoLight from '$lib/../img/spacesocial-logo-light.svg';
    import LogoDark from '$lib/../img/spacesocial-logo-dark.svg';
    import Button from './Button.svelte';
    import Feed from './Feed.svelte';
    import { Client } from '$lib/client/client.js';
    import { play_sound } from '$lib/sound.js';
    import { getTimeline } from '$lib/timeline.js';
    import { goto } from '$app/navigation';

    const VERSION = APP_VERSION;

    let client = false;
    Client.get().subscribe(c => {
        client = c;
    });

    let notification_count = 0;
    if (notification_count > 99) notification_count = "99+";

    function goTimeline() {
        if (location.pathname === "/") {
            getTimeline(true);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }
        goto("/");
    }

    function log_out() {
        if (!confirm("This will log you out. Are you sure?")) return;
        client.logout().then(() => {
            location = "/";
        });
    }
</script>

<div id="navigation">
    {#if client.instance && client.instance.icon_url && client.instance.banner_url}
        <header class="instance-header" style="background-image: url({client.instance.banner_url})">
            <img src={client.instance.icon_url} class="instance-icon" height="92px" aria-hidden="true">
        </header>
    {:else}
        <header class="instance-header">
            <img class="app-icon light-only" src={LogoLight} width="320px" aria-label="Space Social"/>
            <img class="app-icon dark-only" src={LogoDark} width="320px" aria-label="Space Social"/>
        </header>
    {/if}

    <div id="nav-items">
        <Button label="Timeline" on:click={() => goTimeline()} active>🖼️ Timeline</Button>
        <Button label="Notifications" disabled>
            🔔 Notifications
            {#if notification_count}
            <span class="notification-count">{notification_count}</span>
            {/if}
        </Button>
        <Button label="Explore" disabled>🌍 Explore</Button>
        <Button label="Lists" disabled>🗒️ Lists</Button>

        <div class="flex-row">
            <Button centered label="Favourites" disabled>⭐</Button>
            <Button centered label="Bookmarks" disabled>🔖</Button>
            <Button centered label="Hashtags" disabled>#</Button>
        </div>

        <Button filled label="Post" disabled>✏️ Post</Button>
    </div>

    {#if (client.user)}
    <div id="account-items">
        <div class="flex-row">
            <Button centered label="Profile information" disabled>ℹ️</Button>
            <Button centered label="Settings" disabled>⚙️</Button>
            <Button centered label="Log out" on:click={() => log_out()}>🚪</Button>
        </div>

        <div id="account-button">
            <img src={client.user.avatar_url} class="account-avatar" height="64px" alt="" aria-hidden="true" on:click={() => play_sound()}>
            <div class="account-name" aria-hidden="true">
                <span class="nickname" title={client.user.nickname}>{client.user.nickname}</span>
                <span class="username" title={`@${client.user.username}@${client.user.host}`}>
                    {`@${client.user.username}@${client.user.host}`}
                </span>
            </div>
            <!-- <button class="settings" aria-label={`Account: ${client.user.username}@${client.user.host}`} on:click={() => play_sound()}>🔧</button> -->
        </div>
    </div>
    {/if}
    <span class="version">
        space social v{VERSION}
        <br>
        <ul>
            <li><a href="https://git.arimelody.me/ari/spacesocial-client">source</a></li>
        </ul>
    </span>
</div>

<style>
    #navigation {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 16px;
        width: 300px;
        height: calc(100vh - 32px);
        border-radius: 8px;
        background-color: var(--bg-800);
    }

    .instance-header {
        width: 100%;
        height: 172px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background-position: center;
        background-size: cover;
        background-color: var(--bg-600);
        background-image: linear-gradient(to top, var(--bg-800), var(--bg-600));
    }

    .instance-icon {
        height: 50%;
        border-radius: 8px;
    }

    .app-icon {
        max-width: 80%;
        max-height: 80%;
        margin: auto;
    }

    #nav-items {
        margin-bottom: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .notification-count {
        position: relative;
        transform: translate(22px, -16px);
        min-width: 12px;
        height: 28px;
        padding: 0 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: right;
        border-radius: 8px;
        font-weight: 700;
        color: var(--bg-1000);
        background-color: var(--accent);
        box-shadow: 0 0 32px color-mix(in srgb, transparent, var(--accent) 100%);
    }

    #account-items {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .version {
        margin-bottom: 16px;
        font-style: italic;
        font-size: .9em;
        opacity: .6;
        text-align: center;
    }

    .version ul {
        margin: 0;
        padding: 0;
        display: flex;
        gap: 8px;
        justify-content: center;
        list-style: none;
    }

    .version ul li {
        margin: 0;
    }

    .version ul li:not(:first-child):before {
        content: '•';
        margin-right: 8px;
        color: inherit;
        opacity: .7;
    }

    .version a {
        color: inherit;
        text-decoration: none;
        opacity: .7;
    }

    .version a:hover {
        text-decoration: underline;
    }

    #account-button {
        width: calc(100% - 16px);
        height: 48px;
        padding: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;

        font-family: inherit;
        font-size: 1rem;
        font-weight: 600;

        border-radius: 8px;
        background-color: var(--bg-700);
        color: var(--text);
        border-color: transparent;

        transition-property: border-color, background-color, color;
        transition-timing-function: ease-out;
        transition-duration: .1s;

        cursor: pointer;
    }

    .account-avatar {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        transition: transform .1s ease-out, box-shadow .2s;
    }

    .account-avatar:hover {
        transform: scale(1.05);
        box-shadow: 0 0 16px color-mix(in srgb, transparent, var(--accent) 25%);
    }

    .account-avatar:active {
        transform: scale(.95);
        box-shadow: 0 0 16px var(--bg-1000);
    }

    .account-name {
        /* width: 152px; */
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .username, .nickname {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: .8em;
    }

    .username {
        opacity: .8;
        font-size: .65em;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
</style>
