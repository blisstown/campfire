<script>
    import PostHeader from './PostHeader.svelte';
    import Body from './Body.svelte';
    import ReactionButton from './ReactionButton.svelte';
    import ActionButton from './ActionButton.svelte';
    import Post from './Post.svelte';
    import { parseText as parseEmojis, parseOne as parseEmoji } from '../../emoji.js';
    import { shorthand as short_time } from '../../time.js';

    export let post;
    let time_string = post.created_at.toLocaleString();

    function gotoPost() {
        location = `/post/${post.id}`;
    }
</script>

{#if post.reply}
    <svelte:self post={post.reply} />
{/if}

<article class="post-reply" on:click={() => gotoPost()}>
    <div class="line"></div>
        
    <div class="post-reply-main">
        <PostHeader post={post} reply />

        <Body post={post} />

        <footer class="post-footer">
            <div class="post-reactions">
                {#each post.reactions as reaction}
                    <ReactionButton icon={reaction.emoji.html} type="reaction" bind:count={reaction.count} title={reaction.emoji.id} label="" />
                {/each}
            </div>
            <div class="post-actions">
                <ActionButton icon="🗨️" type="reply" label="Reply" bind:count={post.reply_count} sound="post" />
                <ActionButton icon="🔁" type="boost" label="Boost" bind:count={post.boost_count} sound="boost" />
                <ActionButton icon="⭐" type="favourite" label="Favourite" />
                <ActionButton icon="😃" type="react" label="React" />
                <ActionButton icon="🗣️" type="quote" label="Quote" />
                <ActionButton icon="🛠️" type="more" label="More" />
            </div>
        </footer>
    </div>
</article>

<style>
    .post-reply {
        padding-bottom: 24px;
        display: flex;
        flex-direction: row;
        color: var(--text);
        align-items: stretch;
    }

    .post-avatar-container {
        display: flex;
    }

    .line {
        position: relative;
        top: 24px;
        left: 25px;
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
