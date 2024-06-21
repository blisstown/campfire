<script>
    import { parseText as parseEmojis } from '../emoji.js';
    import { shorthand as short_time } from '../time.js';

    export let post;

    let time_string = post.created_at.toLocaleString();
</script>

<div class="post-header-container">
    <a href={post.user.url} target="_blank" class="post-avatar-container">
        <img src={post.user.avatar_url} type={post.user.avatar_type} alt="" width="48" height="48" class="post-avatar" loading="lazy" decoding="async">
    </a>
    <header class="post-header">
        <div class="post-user-info">
            <a href={post.user.url} target="_blank" class="name">{@html post.user.rich_name}</a>
            <span class="username">{post.user.mention}</span>
        </div>
        <div class="post-info">
            <a href={post.url} target="_blank" class="created-at">
                <time title={time_string}>{short_time(post.created_at)}</time>
                {#if post.visibility !== "public"}
                    <span class="post-visibility">({post.visibility})</span>
                {/if}
            </a>
        </div>
    </header>
</div>

<style>
    .post-header-container {
        display: flex;
        flex-direction: row;
    }

    .post-header-container a,
    .post-header-container a:visited {
        color: inherit;
        text-decoration: none;
    }
    .post-header-container a:hover {
        text-decoration: underline;
    }

    .post-avatar-container {
        margin-right: 12px;
        display: flex;
    }

    .post-avatar {
        border-radius: 8px;
        box-shadow: 2px 2px #0004;
    }

    .post-header {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
    }

    .post-info {
        margin-left: auto;
    }

    .post-user-info {
        margin-top: -2px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .post-user-info a {
        display: block;
    }

    .post-user-info .name :global(.emoji) {
        position: relative;
        top: 4px;
        height: 20px;
    }

    .post-user-info .username {
        opacity: .5;
        font-size: .9em;
    }

    .post-info .created-at {
        font-size: .8em;
    }
</style>
