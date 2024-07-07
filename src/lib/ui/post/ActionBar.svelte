<script>
    import * as api from '$lib/api';
    import { get } from 'svelte/store';
    import { server } from '$lib/client/server';
    import { app } from '$lib/client/app';
    import { account } from '@cf/store/account';
    import { timeline } from '$lib/timeline';
    import { parseReactions } from '$lib/post';

    import ActionButton from './ActionButton.svelte';

    import ReplyIcon from '../../../img/icons/reply.svg';
    import RepostIcon from '../../../img/icons/repost.svg';
    import FavouriteIcon from '../../../img/icons/like.svg';
    import FavouriteIconFill from '../../../img/icons/like_fill.svg';
    import QuoteIcon from '../../../img/icons/quote.svg';
    import MoreIcon from '../../../img/icons/more.svg';
    import DeleteIcon from '../../../img/icons/bin.svg';

    export let post;

    async function toggleBoost() {
        let data;
        if (post.boosted)
            data = await api.unboostPost(get(server).host, get(app).token, post.id);
        else
            data = await api.boostPost(get(server).host, get(app).token, post.id);
        if (!data) {
            console.error(`Failed to boost post ${post.id}`);
            return;
        }
        post.boosted = data.reblog ? data.reblog.reblogged : data.boosted;
        post.boost_count = data.reblog ? data.reblog.reblogs_count : data.reblogs_count;
    }

    async function toggleFavourite() {
        let data;
        if (post.favourited)
            data = await api.unfavouritePost(get(server).host, get(app).token, post.id);
        else
            data = await api.favouritePost(get(server).host, get(app).token, post.id);
        if (!data) {
            console.error(`Failed to favourite post ${post.id}`);
            return;
        }
        post.favourited = data.favourited;
        post.favourite_count = data.favourites_count;
        if (data.reactions) post.reactions = parseReactions(data.reactions);
    }

    async function deletePost() {
        if (!$account || post.account.id !== $account.id) return;

        if (!confirm("Are you sure you want to delete this post? This action cannot be undone."))
            return;

        const res = await api.deletePost($server.host, $app.token, post.id);

        if (!res || res.error) {
            console.error(`Error while deleting post ${post.id}`);
            return;
        }

        timeline.update(timeline => timeline.filter(p => p.id !== post.id));
    }
</script>

<div class="post-actions" aria-label="Post actions" role="toolbar" tabindex="0" on:mouseup|stopPropagation on:keydown|stopPropagation>
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
    {#if $account && post.account.id === $account.id}
        <ActionButton type="delete" label="Delete" on:click={deletePost}>
            <DeleteIcon/>
        </ActionButton>
    {/if}
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
