<script>
    import { parseText as parseEmojis } from '../../emoji.js';
    import { shorthand as short_time } from '../../time.js';

    export let post;
    export let reply = undefined;

    let time_string = post.created_at.toLocaleString();
</script>

<div class={"post-header-container" + (reply ? " reply" : "")}>
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
                    <br>
                    <span class="post-visibility">{post.visibility}</span>
                {/if}
            </a>
        </div>
    </header>
</div>

<style>
    .post-header-container {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .post-header-container.reply {
        width: calc(100% + 60px);
        margin-left: -60px;
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
        opacity: .8;
        font-size: .9em;
    }

    .post-info .created-at {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: center;
        font-size: .8em;
    }

    .post-visibility {
        font-size: .9em;
        opacity: .8;
    }
</style>
