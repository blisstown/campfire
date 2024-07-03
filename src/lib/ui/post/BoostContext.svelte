<script>
    import { shorthand as short_time } from '$lib/time.js';

    export let post;

    const time_string = post.created_at.toLocaleString();
</script>

<div class="post-context">
    <span class="post-context-icon">🔁</span>
    <span class="post-context-action">
        <a href={post.account.url} target="_blank"><span class="name">
                {@html post.account.rich_name}</span>
        </a>
        boosted this post.
    </span>
    <span class="post-context-time">
        <time title="{time_string}">{short_time(post.created_at)}</time>
        {#if post.visibility !== "public"}
            <span class="post-visibility">- {post.visibility}</span>
        {/if}
    </span>
</div>

<style>
    .post-context {
        padding: 12px 16px 0 74px;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: .8em;
        font-weight: 600;
        color: var(--text);
        opacity: .8;
        transition: opacity .1s, background-color .1s;
        border-radius: 8px;
        z-index: 1;
    }

    .post-context-icon {
        margin-right: 4px;
    }

    .post-context a,
    .post-context a:visited {
        color: inherit;
        text-decoration: none;
    }
    .post-context a:hover {
        text-decoration: underline;
    }

    .post-context .name :global(.emoji) {
        position: relative;
        top: .2em;
        height: 1.2em;
    }

    .post-context-time {
        margin-left: auto;
    }

    .post-visibility {
        opacity: .7;
    }
</style>
