<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { server } from '$lib/client/server';

    import BoostContext from './BoostContext.svelte';
    import ReplyContext from './ReplyContext.svelte';
    import PostHeader from './PostHeader.svelte';
    import Body from './Body.svelte';
    import ActionBar from './ActionBar.svelte';
    import ReactionBar from './ReactionBar.svelte';

    export let post_data;
    export let focused = false;

    let post_context = undefined;
    let post = post_data;
    let is_boost = !!post_data.boost;
    if (is_boost) {
        post_context = post_data;
        post = post_data.boost;
    }

    let mouse_pos = { top: 0, left: 0 };

    function gotoPost(event) {
        if (focused) return;
        if (event) {
            if (event.type == "mouseup" && (
                event.button !== 0 ||
                event.shiftKey ||
                event.ctrlKey)) return;
            if (event.key && event.key !== "Enter") return;
        }
        goto(`/${$server.host}/${post.account.mention}/${post.id}`);
    }

    let el;
    onMount(() => {
        if (focused) {
            window.scrollTo(0, el.scrollHeight);
        }
    });

    let aria_label = post.account.username + '; ' + post.text + '; ' + post.created_at;
</script>

<div class="post-container">
    {#if post.reply}
        {#await post.reply then reply}
            <ReplyContext post={reply} />
        {/await}
    {/if}
    {#if is_boost && !post_context.text}
        <BoostContext post={post_context} />
    {/if}
    <article
            class={"post" + (focused ? " focused" : "")}
            aria-label={aria_label}
            bind:this={el}
            on:mousedown={e => {mouse_pos.left = e.pageX; mouse_pos.top = e.pageY}}
            on:mouseup={e => {if (e.pageX == mouse_pos.left && e.pageY == mouse_pos.top) gotoPost(e)}}
            on:keydown={gotoPost}>
        <PostHeader post={post} />
        <Body post={post} />
        <footer class="post-footer">
            {#if post.reactions}
                <ReactionBar post={post} />
            {/if}
            <ActionBar post={post} />
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
        cursor: pointer;
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

    .post-container :global(.emoji) {
        height: 20px;
    }
</style>
