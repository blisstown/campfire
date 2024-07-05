<script>
    import * as api from '$lib/api.js';
    import { server, capabilities } from '$lib/client/server.js';
    import { app } from '$lib/client/app.js';
    import { get } from 'svelte/store';
    import { parseReactions } from '$lib/post.js';

    import ReactionButton from './ReactionButton.svelte';
    import ReactIcon from '../../../img/icons/react.svg';

    export let post;

    async function toggleReaction(reaction) {
        if (
            reaction.name.includes('@') &&
            !$server.capabilities.includes(capabilities.FOREIGN_REACTIONS)
        ) return;

        let data;
        if (reaction.me)
            data = await api.unreactPost(get(server).host, get(app).token, post.id, reaction.name);
        else
            data = await api.reactPost(get(server).host, get(app).token, post.id, reaction.name);
        if (!data) {
            console.error(`Failed to favourite post ${post.id}`);
            return;
        }

        post.favourited = data.favourited;
        post.favourite_count = data.favourites_count;
        if (data.reactions) post.reactions = parseReactions(data.reactions);
    }
</script>

<div class="post-reactions" aria-label="Reactions" on:mouseup|stopPropagation on:keydown|stopPropagation>
    {#each post.reactions as reaction}
        <ReactionButton
                type="reaction"
                on:click={() => toggleReaction(reaction)}
                bind:active={reaction.me}
                bind:count={reaction.count}
                disabled={reaction.name.includes('@') && !$server.capabilities.includes(capabilities.FOREIGN_REACTIONS)}
                title={reaction.name}
                label="">
                {#if reaction.url}
                    <img src={reaction.url} class="emoji" height="20" title={reaction.name} alt={reaction.name}>
                {:else}
                    {reaction.name}
                {/if}
        </ReactionButton>
    {/each}
    <ReactionButton
            type="reaction"
            title="react"
            label="React"
            disabled>
    <ReactIcon/>
    </ReactionButton>
</div>

<style>
    .post-reactions {
        width: fit-content;
        min-height: 32px;
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 4px;
    }
</style>
