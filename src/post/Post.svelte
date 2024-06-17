<script>
    import BoostContext from './BoostContext.svelte';
    import ReplyContext from './ReplyContext.svelte';
    import Header from './Header.svelte';
    import Body from './Body.svelte';
    import FooterButton from './FooterButton.svelte';
    import { parse_one as parse_reaction } from '../emoji.js';
    import { play_sound } from '../sound.js';

    export let post;

    let post_context = undefined;
    let _post = post;
    let is_boost = false;
    if (_post.boost) {
        is_boost = true;
        post_context = _post;
        _post = _post.boost;
    }

    let aria_label = post.user.username + '; ' + post.text + '; ' + post.created_at;
</script>

<div class="post-container" aria-label={aria_label}>
    {#if _post.reply}
        <ReplyContext post={_post.reply} />
    {/if}
    {#if is_boost && !post_context.text}
        <BoostContext post={post_context} />
    {/if}
    <article class="post">
        <Header post={_post} />
        <Body post={_post} />
        <footer class="post-footer">
            <div class="post-reactions">
                {#each Object.keys(_post.reactions) as reaction}
                    <FooterButton icon={parse_reaction(reaction, _post.emojis)} type="reaction" bind:count={_post.reactions[reaction]} title={reaction} label="" />
                {/each}
            </div>
            <div class="post-actions">
                <FooterButton icon="🗨️" type="reply" label="Reply" bind:count={_post.reply_count} sound="post" />
                <FooterButton icon="🔁" type="boost" label="Boost" bind:count={_post.boost_count} sound="boost" />
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

    .post-reactions {
        margin-top: 8px;
    }

    .post-actions {
        margin-top: 8px;
    }

    .post-container :global(.emoji) {
        position: relative;
        top: 6px;
        height: 26px;
    }
</style>
