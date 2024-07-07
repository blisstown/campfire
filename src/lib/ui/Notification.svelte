<script>
    import { server } from '$lib/client/server';
    import { goto } from '$app/navigation';

    import ReplyIcon from '$lib/../img/icons/reply.svg';
    import RepostIcon from '$lib/../img/icons/repost.svg';
    import FavouriteIcon from '$lib/../img/icons/like.svg';
    import ReactIcon from '$lib/../img/icons/react.svg';
    // import QuoteIcon from '$lib/../img/icons/quote.svg';
    import ReactionBar from '$lib/ui/post/ReactionBar.svelte';
    import ActionBar from '$lib/ui/post/ActionBar.svelte';

    let mention = (accounts) => {
        let res = `<a href=${account.url}>${account.rich_name}</a>`;
        if (accounts.length > 1) res += ` and <strong>${accounts.length - 1}</strong> others`;
        return res;
    };

    export let data;
    let activity_text = function (type) {
        switch (type) {
            case "mention":
                return `%1 mentioned you.`;
            case "reblog":
                return `%1 boosted your post.`;
            case "reaction":
                return `%1 reacted to your post.`;
            case "follow":
                return `%1 followed you.`;
            case "follow_request":
                return `%1 requested to follow you.`;
            case "favourite":
                return `%1 favourited your post.`;
            case "poll":
                return `%1's poll as ended.`;
            case "update":
                return `%1 updated their post.`;
            default:
                return `%1 poked you!`;
        }
    }(data.type);

    let account = data.accounts[0];
    $: accounts_short = data.accounts.slice(0, 3).reverse();

    let mouse_pos = { top: 0, left: 0 };

    function gotoPost(event) {
        if (!data.status) return;
        if (event) {
            if (event.type == "mouseup" && (
                event.button !== 0 ||
                event.shiftKey ||
                event.ctrlKey)) return;
            if (event.key && event.key !== "Enter") return;
        }
        goto(`/${$server.host}/${data.status.account.mention}/${data.status.id}`);
    }
    
    let aria_label = function (data) {
        if (data.accounts.length == 1)
            return activity_text.replace("%1", account.username) + ' ' + new Date(data.created_at);
        else
            return activity_text.replace("%1", `${account.username} and ${data.accounts.length - 1} others`) + ' ' + new Date(data.created_at);
    }(data);
</script>

<article
        class="notification"
        aria-label={aria_label}
        on:mousedown={e => {mouse_pos.left = e.pageX; mouse_pos.top = e.pageY}}
        on:mouseup={e => {if (e.pageX == mouse_pos.left && e.pageY == mouse_pos.top) gotoPost(e)}}
        on:keydown={gotoPost}>
    <header aria-hidden>
        <span class="notif-icon">
            {#if data.type === "favourite"}
                <FavouriteIcon />
            {:else if data.type === "reblog"}
                <RepostIcon />
            {:else if data.type === "reaction"}
                <ReactIcon />
            {:else if data.type === "mention"}
                <ReplyIcon />
            {:else}
                <ReactIcon />
            {/if}
        </span>
        <span class="notif-avatars">
            {#if data.accounts.length == 1}
                <a href={data.accounts[0].url} class="notif-avatar">
                    <img src={data.accounts[0].avatar_url} alt="" width="28" height="28" />
                </a>
            {:else}
                {#each accounts_short as account}
                    <img src={account.avatar_url} alt="" width="28" height="28" />
                {/each}
            {/if}
        </span>
        <span class="notif-activity">{@html activity_text.replace("%1", mention(data.accounts))}</span>
        <!-- TODO: timestamps -->
    </header>
    {#if data.status}
        <div class="notif-content">
            {#if data.status.warning}
                <div class="warning">
                    {data.status.warning}
                </div>
            {:else}
                {@html data.status.html}
            {/if}
        </div>
        {#if data.type === "mention"}
            {#if data.status.reactions}
                <ReactionBar post={data.status} />
            {/if}
            <ActionBar post={data.status} />
        {/if}
    {/if}
</article>

<style>
    .notification {
        display: block;
        margin-bottom: 8px;
        padding: 16px;
        border-radius: 8px;
        background: var(--bg-800);
        text-decoration: inherit;
        color: inherit;
        transition: background-color .1s;
    }

    .notification:hover {
        background-color: color-mix(in srgb, var(--bg-800), black 5%);
    }

    header {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    header .notif-icon {
        width: 28px;
        height: 28px;
        display: inline-flex;
    }

    header .notif-avatars {
        display: inline-flex;
        flex-direction: row-reverse;
    }

    header .notif-avatar {
        line-height: 0;
    }
    header .notif-avatars img {
        border-radius: 4px;
    }
    header .notif-avatars img:not(:first-child) {
        box-shadow: 4px 0 8px -2px rgba(0,0,0,.33);
    }
    header .notif-avatars img:not(:last-child) {
        margin-left: -8px;
    }

    header .notif-activity {
        width: 100%;
    }

    header :global(a) {
        font-weight: bold;
        color: var(--text);
    }

    header :global(.emoji) {
        margin: -.2em 0;
    }

    .notif-content {
        margin: 16px 0 4px 0;
        font-size: 14px;
        line-height: 1.45em;
    }

    .notif-content :global(p) {
        margin: 0;
    }

    .notif-content :global(.emoji) {
        position: relative;
        top: 6px;
        margin-top: -10px;
        height: 24px!important;
    }

    .notif-content :global(blockquote) {
        margin: .4em 0;
        padding: .1em 0 .1em 1em;
        border-left: 4px solid #8888;
    }

    .notif-content :global(blockquote span) {
        opacity: .5;
    }

    .notif-content :global(code) {
        font-size: 1.2em;
    }

    .notif-content :global(pre:has(code)) {
        margin: 8px 0;
        padding: 8px;
        display: block;
        overflow-x: scroll;
        border-radius: 8px;
        background-color: #080808;
        color: var(--accent);
    }

    .notif-content :global(pre code) {
        margin: 0;
    }

    .notif-content :global(a) {
        color: var(--accent);
    }

    .notif-content :global(a.mention) {
        color: inherit;
        font-weight: 600;
        padding: 3px 6px;
        background: var(--bg-700);
        border-radius: 6px;
        text-decoration: none;
    }

    .notif-content :global(a.mention:hover) {
        text-decoration: underline;
    }

    .notif-content :global(a.hashtag) {
        background-color: transparent;
        padding: 0;
        font-style: italic;
    }

    .notif-content :global(.mention-avatar) {
        position: relative;
        top: 4px;
        height: 20px;
        margin-right: 4px;
        border-radius: 4px;
    }

    .notif-content .warning {
        width: calc(100% - 16px);
        margin-bottom: 10px;
        padding: 4px 8px;
        --warn-bg: color-mix(in srgb, var(--bg-700), var(--accent) 1%);
        background: repeating-linear-gradient(-45deg, transparent, transparent 10px, var(--warn-bg) 10px, var(--warn-bg) 20px);
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        text-align: left;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        outline-color: var(--warn-bg);
        transition: outline .05s, box-shadow .05s;
    }
</style>
