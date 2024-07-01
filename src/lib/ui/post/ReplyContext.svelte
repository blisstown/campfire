<script>
    import { parseText as parseEmojis, parseOne as parseEmoji } from '../../emoji.js';
    import { shorthand as short_time } from '../../time.js';
    import * as api from '../../client/api.js';
    import { goto } from '$app/navigation';

    import PostHeader from './PostHeader.svelte';
    import Body from './Body.svelte';
    import Post from './Post.svelte';
    import ActionBar from './ActionBar.svelte';
    import ReactionBar from './ReactionBar.svelte';

    export let post;
    let time_string = post.created_at.toLocaleString();
    let aria_label = post.user.username + '; ' + post.text + '; ' + post.created_at;

    let mouse_pos = { top: 0, left: 0 };

    function gotoPost() {
        if (event && event.key && event.key !== "Enter") return;
        goto(`/post/${post.id}`);
    }
</script>

{#if post.reply}
    {#await post.reply then reply}
        <svelte:self post={reply} />
    {/await}
{/if}

<article
        class="post-reply"
        aria-label={aria_label}
        on:mousedown={e => {mouse_pos.left = e.pageX; mouse_pos.top = e.pageY}}
        on:mouseup={e => {if (e.pageX == mouse_pos.left && e.pageY == mouse_pos.top) gotoPost()}}
        on:keydown={gotoPost}>
    <div class="line"></div>
        
    <div class="post-reply-main">
        <PostHeader post={post} reply />

        <Body post={post} />

        <footer class="post-footer">
            {#if post.reactions}
                <ReactionBar post={post} />
            {/if}
            <ActionBar post={post} />
        </footer>
    </div>
</article>

<style>
    .post-reply {
        padding: 16px 16px 16px 16px;
        display: flex;
        flex-direction: row;
        color: var(--text);
        align-items: stretch;
        border-radius: 8px;
        transition: background-color .1s;
        cursor: pointer;
    }

    .post-reply:hover {
        background-color: color-mix(in srgb, var(--bg-800), black 5%);
    }

    .post-avatar-container {
        display: flex;
    }

    .line {
        position: relative;
        top: 32px;
        left: 23px;
        border-right: 2px solid var(--bg-700);
    }

    .post-reply-main {
        width: 100%;
        padding-left: 60px;
        z-index: 1;
    }

    :global(.post-body) {
        margin-top: 0;
    }

    :global(.post-body p) {
        margin: 0;
    }
</style>
