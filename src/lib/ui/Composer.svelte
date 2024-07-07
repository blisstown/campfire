<script lang="js">
    import { account } from '@cf/store/account';
    import * as api from '$lib/api';
    import { server } from '$lib/client/server';
    import { app } from '$lib/client/app';
    import { parsePost } from '$lib/post.js';
    import { timeline } from '$lib/timeline.js';
    import { createEventDispatcher } from 'svelte';

    import Button from '@cf/ui/Button.svelte';
    import PostIcon from '@cf/icons/post.svg';
    import MediaIcon from '@cf/icons/media.svg';
    import PollIcon from '@cf/icons/poll.svg';
    import WarningIcon from '@cf/icons/warning.svg';

    import PublicVisIcon from '@cf/icons/public.svg';

    let content_warning = ""
    let content = "";
    // let media_ids = [];
    let show_cw = false;
    const placeholders = [
        "What's cooking, $1?",
        "Speak your mind!",
        "Federate something...",
        "I sure love posting!",
        "Another day, another $1 post!",
    ];
    let placeholder = placeholders[Math.floor(placeholders.length * Math.random())]
        .replaceAll("$1", $account.username);

    const dispatch = createEventDispatcher();

    async function buildPost() {
        let postdata = {}
        if(show_cw) {
            postdata.spoiler_text = content_warning;
        }

        if(!content) return;
        postdata.status = content;

        let new_post = await api.createPost($server.host, $app.token, postdata);
        let new_post_parsed = await parsePost(new_post);

        timeline.update(current => [new_post_parsed, ...current]);
        dispatch("compose_finished")
    }
</script>

<div class="composer">
    <div class="composer-header-container">
        <a href={$account.url} target="_blank" class="composer-avatar-container" on:mouseup|stopPropagation>
            <img src={$account.avatar_url} type={$account.avatar_type} alt="" width="48" height="48" class="composer-avatar" loading="lazy" decoding="async">
        </a>
        <header class="composer-header">
            <div class="composer-user-info" on:mouseup|stopPropagation>
                {@html $account.rich_name}
                <span class="username">{$account.mention}</span>
            </div>
            <div class="composer-info" on:mouseup|stopPropagation>
            </div>
        </header>
        <div>
            <Button centered={true}>
                <svelte:fragment slot="icon">
                    <PublicVisIcon/>
                </svelte:fragment>
            </Button>
        </div>
    </div>
    {#if show_cw}
        <input type="text" id="" placeholder="content warning" bind:value={content_warning}/>
    {/if}
    <textarea placeholder="{placeholder}" class="textbox" bind:value={content}></textarea>
    <div class="composer-footer">
        <div class="actions">
            <Button centered={true} disabled>
                <svelte:fragment slot="icon">
                    <MediaIcon/>
                </svelte:fragment>
            </Button>
            <Button centered={true} disabled>
                <svelte:fragment slot="icon">
                    <PollIcon/>
                </svelte:fragment>
            </Button>
            <Button centered={true} active={show_cw} on:click={() => show_cw = !show_cw}>
                <svelte:fragment slot="icon">
                    <WarningIcon/>
                </svelte:fragment>
            </Button>
        </div>
        <Button filled={true} centered={true} class="postbtn" on:click={buildPost}>
            <svelte:fragment slot="icon">
                <PostIcon/>
            </svelte:fragment>
            Post
        </Button>
    </div>
</div>

<style>
    .composer {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .composer-footer {
        display: flex;
    }

    .composer-footer div {
        width: 100%;
        display: flex;
        gap: 16px;
    }

    .composer-footer div :global(button) {
        width: 58px;
    }

    .composer-footer :global(button) {
        width: 30%;
    }

    input[type="text"], textarea {
        box-sizing: border-box;
        padding: 8px 8px;
        border-radius: 8px;
        border-style: none;
        font-size: 1em;
        width: 100%;

        background-color: var(--bg-700);
        color: var(--text);
        font-family: inherit;

        border-radius: 8px;
        border: 1px solid color-mix(in srgb, transparent, var(--accent) 25%);
    }

    input[type="text"]:focus, textarea:focus {
        outline: none;
        box-shadow: 0 0 16px color-mix(in srgb, transparent, var(--accent) 25%);
    }

    .textbox {
        resize: none;
        height: 160px;
    }


    .composer-header-container {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .composer-avatar {
        border-radius: 8px;
        margin-right: 12px;
        display: flex;
    }

    .composer-header {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
    }

    .composer-info {
        margin-left: auto;
    }

    .composer-user-info {
        margin-top: -2px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .composer-user-info .name :global(.emoji) {
        position: relative;
        top: .2em;
        height: 1.2em;
    }

    .composer-user-info .username {
        opacity: .8;
        font-size: .9em;
    }
</style>
