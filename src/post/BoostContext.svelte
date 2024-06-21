<script>
    import { parseText as parseEmojis } from '../emoji.js';
    import { shorthand as short_time } from '../time.js';

    export let post;

    let time_string = post.created_at.toLocaleString();
</script>

<div class="post-context">
    <span class="post-context-icon">🔁</span>
    <span class="post-context-action">
        <a href="/{post.user.mention}">{@html parseEmojis(post.user.rich_name)}</a> boosted this post.
    </span>
    <span class="post-context-time">
        <time title="{time_string}">{short_time(post.created_at)}</time>
    </span>
</div>

<style>
    .post-context {
        margin-bottom: 8px;
        padding-left: 58px;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--accent);
        opacity: .8;
        transition: opacity .1s;
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

    .post-context-time {
        margin-left: auto;
    }
</style>
