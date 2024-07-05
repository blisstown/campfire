<script>
    import * as api from '$lib/api.js';
    import { account, logged_in } from '$lib/stores/account.js';
    import { server } from '$lib/client/server.js';
    import { app } from '$lib/client/app.js';
    import { play_sound } from '$lib/sound.js';
    import { getTimeline } from '$lib/timeline.js';
    import { getNotifications } from '$lib/notifications.js';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import { createEventDispatcher } from 'svelte';
    import { unread_notif_count, last_read_notif_id } from '$lib/notifications.js';

    import Logo from '$lib/../img/campfire-logo.svg';
    import Button from './Button.svelte';
    import Feed from './Feed.svelte';

    import TimelineIcon from '../../img/icons/timeline.svg';
    import NotificationsIcon from '../../img/icons/notifications.svg';
    import ExploreIcon from '../../img/icons/explore.svg';
    import ListIcon from '../../img/icons/lists.svg';
    import FavouritesIcon from '../../img/icons/like_fill.svg';
    import BookmarkIcon from '../../img/icons/bookmark.svg';
    import HashtagIcon from '../../img/icons/hashtag.svg';
    import PostIcon from '../../img/icons/post.svg';
    import InfoIcon from '../../img/icons/info.svg';
    import SettingsIcon from '../../img/icons/settings.svg';
    import LogoutIcon from '../../img/icons/logout.svg';

    const VERSION = APP_VERSION;

    const dispatch = createEventDispatcher();

    function handle_btn(name) {
        if (!get(logged_in)) return;
        let route;
        switch (name) {
            case "timeline":
                route = "/";
                getTimeline(true);
                break;
            case "notifications":
                route = "/notifications";
                getNotifications(true);
                break;
            case "explore":
            case "lists":
            case "favourites":
            case "bookmarks":
            case "hashtags":
            default:
                return;
        }
        if (!route) return;
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        goto(route);
    }

    async function log_out() {
        if (!confirm("This will log you out. Are you sure?")) return;
        
        const res = await api.revokeToken(
            get(server).host,
            get(app).id,
            get(app).secret,
            get(app).token
        );

        if (!res.ok)
            console.warn("Token revocation failed! Dumping data anyways");

        logged_in.set(false);
        account.set(false);
        app.set(false);
        server.set(false);

        goto("/");
    }
</script>

<div id="navigation">
    <header class="server-header">
        <div class="app-logo">
            <Logo />
        </div>
    </header>

    {#if $logged_in}
    <div id="nav-items">
        <Button label="Timeline"
                on:click={() => handle_btn("timeline")}
                active={$page.url.pathname === "/"}>
            <svelte:fragment slot="icon">
                <TimelineIcon/>
            </svelte:fragment>
            Timeline
        </Button>
        <Button label="Notifications"
                on:click={() => handle_btn("notifications")}
                active={$page.url.pathname === "/notifications"}>
            <svelte:fragment slot="icon">
                <NotificationsIcon/>
            </svelte:fragment>
            Notifications
            {#if $unread_notif_count}
                <span class="notification-count">
                    {$unread_notif_count <= 99 ? $unread_notif_count : "99+"}
                </span>
            {/if}
        </Button>
        <Button label="Explore" disabled>
            <svelte:fragment slot="icon">
                <ExploreIcon height="auto"/>
            </svelte:fragment>
            Explore
        </Button>
        <Button label="Lists" disabled>
            <svelte:fragment slot="icon">
                <ListIcon/>
            </svelte:fragment>
            Lists
        </Button>

        <div class="flex-row">
            <Button centered label="Favourites" disabled>
                <svelte:fragment slot="icon">
                    <FavouritesIcon/>
                </svelte:fragment>
            </Button>
            <Button centered label="Bookmarks" disabled>
                <svelte:fragment slot="icon">
                    <BookmarkIcon/>
                </svelte:fragment>
            </Button>
            <Button centered label="Hashtags" disabled>
                <svelte:fragment slot="icon">
                    <HashtagIcon/>
                </svelte:fragment>
            </Button>
        </div>

        <Button filled label="Post" disabled on:click={() => dispatch("compose")}>
            <svelte:fragment slot="icon">
                <PostIcon/>
            </svelte:fragment>
            Post
        </Button>
    </div>

    <div id="account-items">
        <div class="flex-row">
            <Button centered label="Profile information" disabled>
                <svelte:fragment slot="icon">
                    <InfoIcon/>
                </svelte:fragment>
            </Button>
            <Button centered label="Settings" disabled>
                <svelte:fragment slot="icon">
                    <SettingsIcon/>
                </svelte:fragment>
            </Button>
            <Button centered label="Log out" on:click={() => log_out()}>
                <svelte:fragment slot="icon">
                    <LogoutIcon/>
                </svelte:fragment>
            </Button>
        </div>

        <div id="account-button">
            <img src={$account.avatar_url} class="account-avatar" height="64px" alt="" aria-hidden="true" on:click={() => play_sound()}>
            <div class="account-name" aria-hidden="true">
                <a href={$account.url} class="nickname" title={$account.nickname}>{@html $account.rich_name}</a>
                <span class="username" title={`@${$account.username}@${$account.host}`}>
                    {`@${$account.username}@${$account.host}`}
                </span>
            </div>
        </div>
    </div>
    {/if}
    <span class="version">
        campfire v{VERSION}
        <br>
        <ul>
            <li><a href="https://git.arimelody.me/blisstown/campfire">source</a></li>
            <li><a href="https://github.com/blisstown/campfire/issues">issues</a></li>
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

    .server-header {
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

    .server-icon {
        height: 50%;
        border-radius: 8px;
    }

    .app-logo {
        max-width: 70%;
        max-height: 70%;
        margin: auto;
    }

    .app-logo :global(svg) {
        width: 100%;
        height: 100%;
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
        margin-left: auto;
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
        color: inherit;
    }

    .username {
        opacity: .8;
        font-size: .65em;
    }

    .nickname :global(.emoji) {
        height: 1.2em;
        margin: -.1em 0;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
</style>
