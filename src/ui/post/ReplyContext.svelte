<script>
    import PostHeader from './PostHeader.svelte';
    import Body from './Body.svelte';
    import ReactionButton from './ReactionButton.svelte';
    import ActionButton from './ActionButton.svelte';
    import Post from './Post.svelte';
    import { parseText as parseEmojis, parseOne as parseEmoji } from '../../emoji.js';
    import { shorthand as short_time } from '../../time.js';
    import { get } from 'svelte/store';
    import { Client } from '../../client/client.js';
    import * as api from '../../client/api.js';

    export let post;
    let time_string = post.created_at.toLocaleString();

    function gotoPost() {
        location = `/post/${post.id}`;
    }

    async function toggleBoost() {
        let client = get(Client.get());
        let data;
        if (post.boosted)
            data = await client.unboostPost(post.id);
        else
            data = await client.boostPost(post.id);
        if (!data) {
            console.error(`Failed to boost post ${post.id}`);
            return;
        }
        post.boosted = data.boosted;
        post.boost_count = data.reblogs_count;
    }

    async function toggleFavourite() {
        let client = get(Client.get());
        let data;
        if (post.favourited)
            data = await client.unfavouritePost(post.id);
        else
            data = await client.favouritePost(post.id);
        if (!data) {
            console.error(`Failed to favourite post ${post.id}`);
            return;
        }
        post.favourited = data.favourited;
        post.favourite_count = data.favourites_count;
        if (data.reactions) post.reactions = api.parseReactions(data.reactions);
    }

    async function toggleReaction(reaction) {
        if (reaction.name.includes('@')) return;
        let client = get(Client.get());

        let data;
        if (reaction.me)
            data = await client.unreactPost(post.id, reaction.name);
        else
            data = await client.reactPost(post.id, reaction.name);
        if (!data) {
            console.error(`Failed to favourite post ${post.id}`);
            return;
        }
        post.favourited = data.favourited;
        post.favourite_count = data.favourites_count;
        if (data.reactions) post.reactions = api.parseReactions(data.reactions);
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
            <div class="post-reactions" on:click|stopPropagation>
                {#each post.reactions as reaction}
                    <ReactionButton
                            type="reaction"
                            on:click={() => toggleReaction(reaction)}
                            bind:active={reaction.me}
                            bind:count={reaction.count}
                            disabled={reaction.name.includes('@')}
                            title={reaction.name}
                            label="">
                        {#if reaction.url}
                            <img src={reaction.url} class="emoji" height="20" title={reaction.name} alt={reaction.name}>
                        {:else}
                            {reaction.name}
                        {/if}
                    </ReactionButton>
                {/each}
            </div>
            <div class="post-actions" on:click|stopPropagation>
                <ActionButton type="reply" label="Reply" bind:count={post.reply_count} sound="post" disabled>🗨️</ActionButton>
                <ActionButton type="boost" label="Boost" on:click={() => toggleBoost()} bind:active={post.boosted} bind:count={post.boost_count} sound="boost">🔁</ActionButton>
                <ActionButton type="favourite" label="Favourite" on:click={() => toggleFavourite()} bind:active={post.favourited} bind:count={post.favourite_count}>⭐</ActionButton>
                <ActionButton type="react" label="React" disabled>😃</ActionButton>
                <ActionButton type="quote" label="Quote" disabled>🗣️</ActionButton>
                <ActionButton type="more" label="More" disabled>🛠️</ActionButton>
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
