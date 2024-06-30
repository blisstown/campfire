<script>
    import { Client } from '../../client/client.js';
    import * as api from '../../client/api.js';
    import { get } from 'svelte/store';

    import ActionButton from './ActionButton.svelte';

    import ReplyIcon from '../../../img/icons/reply.svg';
    import RepostIcon from '../../../img/icons/repost.svg';
    import FavouriteIcon from '../../../img/icons/like.svg';
    import FavouriteIconFill from '../../../img/icons/like_fill.svg';
    import ReactIcon from '../../../img/icons/react.svg';
    import QuoteIcon from '../../../img/icons/quote.svg';
    import MoreIcon from '../../../img/icons/more.svg';

    export let post;

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
        post.boosted = data.reblog ? data.reblog.reblogged : data.boosted;
        post.boost_count = data.reblog ? data.reblog.reblogs_count : data.reblogs_count;
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

<div class="post-actions" aria-label="Post actions" on:mouseup|stopPropagation on:keydown|stopPropagation>
    <ActionButton type="reply" label="Reply" bind:count={post.reply_count} sound="post" disabled>
        <ReplyIcon/>
    </ActionButton>
    <ActionButton type="boost" label="Boost" on:click={toggleBoost} bind:active={post.boosted} bind:count={post.boost_count} sound="boost">
        <RepostIcon/>
        <svelte:fragment slot="activeIcon">
            <RepostIcon/>
        </svelte:fragment>
    </ActionButton>
    <ActionButton type="favourite" label="Favourite" on:click={toggleFavourite} bind:active={post.favourited} bind:count={post.favourite_count}>
        <FavouriteIcon/>
        <svelte:fragment slot="activeIcon">
            <FavouriteIconFill/>
        </svelte:fragment>
    </ActionButton>
    <ActionButton type="quote" label="Quote" disabled>
        <QuoteIcon/>
    </ActionButton>
    <ActionButton type="more" label="More" disabled>
        <MoreIcon/>
    </ActionButton>
</div>

<style>
    .post-actions {
        width: fit-content;
        height: 36px;
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        gap: 4px;
    }
</style>
