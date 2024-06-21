<script>
    import BoostContext from './BoostContext.svelte';
    import ReplyContext from './ReplyContext.svelte';
    import Header from './Header.svelte';
    import Body from './Body.svelte';
    import FooterButton from './FooterButton.svelte';
    import { parseOne as parseEmoji } from '../emoji.js';
    import { play_sound } from '../sound.js';

    export let post_data;

    let post_context = undefined;
    let post = post_data;
    let is_boost = false;
    if (post_data.boost) {
        is_boost = true;
        post_context = post_data;
        post = post_data.boost;
    }

    let aria_label = post.user.username + '; ' + post.text + '; ' + post.created_at;
</script>

<div class="post-container" aria-label={aria_label}>
    {#if post.reply}
        <ReplyContext post={post.reply} />
    {/if}
    {#if is_boost && !post_context.text}
        <BoostContext post={post_context} />
    {/if}
    <article class="post">
        <Header post={post} />
        <Body post={post} />
        <footer class="post-footer">
            <div class="post-reactions">
                {#each post.reactions as reaction}
                    <FooterButton icon={reaction.emoji.html} type="reaction" bind:count={reaction.count} title={reaction.emoji.id} label="" />
                {/each}
            </div>
            <div class="post-actions">
                <FooterButton icon="🗨️" type="reply" label="Reply" bind:count={post.reply_count} sound="post" />
                <FooterButton icon="🔁" type="boost" label="Boost" bind:count={post.boost_count} sound="boost" />
                <FooterButton icon="⭐" type="favourite" label="Favourite" />
                <FooterButton icon="😃" type="react" label="React" />
                <FooterButton icon="🗣️" type="quote" label="Quote" />
                <FooterButton icon="🛠️" type="more" label="More" />
            </div>
        </footer>
    </article>
</div>

<style>
    .post-container {
        margin-top: 16px;
        padding: 28px 32px 20px 32px;
        border: 1px solid #8884;
        border-radius: 16px;
        background-color: var(--bg1);
        transition: background-color .1s;
    }

    .post-container:hover {
        background-color: var(--bg2);
    }

    .post-container:hover :global(.post-context) {
        opacity: 1;
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
