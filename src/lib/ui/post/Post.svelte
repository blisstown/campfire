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
    import { get } from 'svelte/store';
    import { Client } from '../../client/client.js';
    import * as api from '../../client/api.js';
    import { goto } from '$app/navigation';

    export let post_data;
    export let focused = false;

    let post_context = undefined;
    let post = post_data;
    let is_boost = !!post_data.boost;
    if (is_boost) {
        post_context = post_data;
        post = post_data.boost;
    }

    function gotoPost() {
        if (focused) return;
        if (event.key && event.key !== "Enter") return;
        console.log(`/post/${post.id}`);
        goto(`/post/${post.id}`);
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

    let el;
    onMount(() => {
        if (focused) {
            window.scrollTo(0, el.scrollHeight);
        }
    });

    let aria_label = post.user.username + '; ' + post.text + '; ' + post.created_at;

    if (post.reply && post.reply.id === undefined) console.log(post);
</script>

<div class="post-container">
    {#if post.reply}
        <ReplyContext post={post.reply} />
    {/if}
    {#if is_boost && !post_context.text}
        <BoostContext post={post_context} />
    {/if}
    <article
            class={"post" + (focused ? " focused" : "")}
            aria-label={aria_label}
            bind:this={el}
            on:click={gotoPost}
            on:keydown={gotoPost}>
        <PostHeader post={post} />
        <Body post={post} />
        <footer class="post-footer">
            <div class="post-reactions" aria-label="Reactions" on:click|stopPropagation on:keydown|stopPropagation>
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
            <div class="post-actions" aria-label="Post actions" on:click|stopPropagation on:keydown|stopPropagation>
                <ActionButton type="reply" label="Reply" bind:count={post.reply_count} sound="post" disabled>🗨️</ActionButton>
                <ActionButton type="boost" label="Boost" on:click={() => toggleBoost()} bind:active={post.boosted} bind:count={post.boost_count} sound="boost">🔁</ActionButton>
                <ActionButton type="favourite" label="Favourite" on:click={() => toggleFavourite()} bind:active={post.favourited} bind:count={post.favourite_count}>⭐</ActionButton>
                <ActionButton type="react" label="React" disabled>😃</ActionButton>
                <ActionButton type="quote" label="Quote" disabled>🗣️</ActionButton>
                <ActionButton type="more" label="More" disabled>🛠️</ActionButton>
            </div>
        </footer>
    </article>
</div>

<style>
    .post-container {
        width: 732px;
        max-width: 732px;
        margin-bottom: 8px;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        background-color: var(--bg-800);
    }

    .post {
        padding: 16px;
        border-radius: 8px;
        transition: background-color .1s;
    }
    
    .post:not(.focused) {
        cursor: pointer;
    }

    .post.focused {
        border: 1px solid color-mix(in srgb, transparent, var(--accent) 20%);
        box-shadow: 0 0 16px color-mix(in srgb, transparent, var(--accent) 20%);
    }

    .post:hover {
        background-color: color-mix(in srgb, var(--bg-800), black 5%);
    }

    .post-container:has(.post-context) .post {
        padding-top: 40px;
        margin-top: -32px;
    }

    :global(.post-reactions) {
        width: fit-content;
        display: flex;
        flex-direction: row;
        gap: 4px;
    }

    :global(.post-actions) {
        width: fit-content;
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        gap: 2px;
    }

    .post-container :global(.emoji) {
        height: 20px;
    }
</style>
