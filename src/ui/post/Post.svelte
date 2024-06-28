<script>
    import BoostContext from './BoostContext.svelte';
    import ReplyContext from './ReplyContext.svelte';
    import PostHeader from './PostHeader.svelte';
    import Body from './Body.svelte';
    import ReactionButton from './ReactionButton.svelte';
    import ActionButton from './ActionButton.svelte';
    import { parseOne as parseEmoji } from '../../emoji.js';
    import { play_sound } from '../../sound.js';
    import { onMount } from 'svelte';

    export let post_data;
    export let focused = false;

    let post_context = undefined;
    let post = post_data;
    let is_boost = false;
    if (post_data.boost) {
        is_boost = true;
        post_context = post_data;
        post = post_data.boost;
    }

    function gotoPost() {
        location = `/post/${post.id}`;
    }

    let el;
    onMount(() => {
        if (focused) {
            window.scrollTo(0, el.scrollHeight - 700);
        }
    });

    let aria_label = post.user.username + '; ' + post.text + '; ' + post.created_at;
</script>

<div class="post-container" aria-label={aria_label} bind:this={el}>
    {#if post.reply}
        <ReplyContext post={post.reply} />
    {/if}
    {#if is_boost && !post_context.text}
        <BoostContext post={post_context} />
    {/if}
    <article class={"post" + (focused ? " focused" : "")} on:click={!focused ? gotoPost() : null}>
        <PostHeader post={post} />
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
    </article>
</div>

<style>
    .post-container {
        width: 700px;
        max-width: 700px;
        margin-bottom: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        background-color: var(--bg-800);
        transition: background-color .1s;
    }

    .post-container:hover {
        background-color: color-mix(in srgb, var(--bg-800), black 5%);
    }

    .post-container:hover :global(.post-context) {
        opacity: 1;
    }
    
    .post:not(.focused) {
        cursor: pointer;
    }

    .post.focused {
        padding: 16px;
        margin: -16px;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, transparent, var(--accent) 20%);
        box-shadow: 0 0 16px color-mix(in srgb, transparent, var(--accent) 20%);
    }

    :global(.post-reactions) {
        display: flex;
        flex-direction: row;
    }

    :global(.post-actions) {
        margin-top: 8px;
        display: flex;
        flex-direction: row;
    }

    .post-container :global(.emoji) {
        height: 20px;
    }
</style>
