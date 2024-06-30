<script>
    import ReactionButton from './ReactionButton.svelte';
    import ReactIcon from '../../../img/icons/react.svg';

    export let post;
</script>

<div class="post-reactions" aria-label="Reactions" on:mouseup|stopPropagation on:keydown|stopPropagation>
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
        height: 32px;
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        gap: 2px;
    }
</style>
