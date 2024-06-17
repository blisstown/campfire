<script>
    import Header from './Header.svelte';
    import Body from './Body.svelte';
    import FooterButton from './FooterButton.svelte';
    import Post from './Post.svelte';
    import { parse_text as parse_emojis, parse_one as parse_reaction } from '../emoji.js';
    import { shorthand as short_time } from '../time.js';

    export let post;

    let time_string = post.created_at.toLocaleString();
</script>

<article class="post-reply">
    <div class="post-reply-avatar-container">
        <a href="/{post.user.mention}" class="post-avatar-container">
            <img src={post.user.avatar_url} type={post.user.avatar_type} alt="" width="48" height="48" class="post-avatar" loading="lazy" decoding="async">
        </a>
        <div class="line">
        </div>
    </div>

    <div class="post-reply-main">
        <div class="post-header-container">
            <header class="post-header">
                <div class="post-user-info">
                    <a href="/{post.user.mention}" class="name">{@html parse_emojis(post.user.name, post.user.emojis, true)}</a>
                    <span class="username">{post.user.mention}</span>
                </div>
                <div class="post-info">
                    <a href={post.url} class="created-at">
                        <time title={time_string}>{short_time(post.created_at)}</time>
                    </a>
                </div>
            </header>
        </div>

        <Body post={post} />

        <footer class="post-footer">
            <div class="post-reactions">
                {#each Object.keys(post.reactions) as reaction}
                    <FooterButton icon={parse_reaction(reaction, post.emojis)} type="reaction" bind:count={post.reactions[reaction]} title={reaction} label="" />
                {/each}
            </div>
            <div class="post-actions">
                <FooterButton icon="🗨️" type="reply" label="Reply" bind:count={post.reply_count} />
                <FooterButton icon="🔁" type="boost" label="Boost" bind:count={post.boost_count} />
                <FooterButton icon="⭐" type="favourite" label="Favourite" />
                <FooterButton icon="😃" type="react" label="React" />
                <FooterButton icon="🗣️" type="quote" label="Quote" />
                <FooterButton icon="🛠️" type="more" label="More" />
            </div>
        </footer>
    </div>
</article>

<style>
    .post-reply {
        padding-bottom: 24px;
        display: flex;
        flex-direction: row;
    }

    .post-reply-avatar-container {
        margin-right: 12px;
        margin-bottom: -24px;
    }

    .post-reply-avatar-container .line {
        position: relative;
        top: -4px;
        left: -1px;
        width: 50%;
        height: calc(100% - 48px);
        border-right: 2px solid #8888;
    }

    .post-reply-main {
        flex-grow: 1;
    }

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

    .post-user-info a {
        display: block;
    }

    .post-user-info .name :global(.emoji) {
        position: relative;
        top: 4px;
        max-height: 1.25em;
    }

    .post-user-info .username {
        opacity: .5;
        font-size: .9em;
    }

    .post-info .created-at {
        font-size: .8em;
    }
</style>
