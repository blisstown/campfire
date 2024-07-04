<script>
    import { account } from '@cf/store/account';
    import Button from '@cf/ui/Button.svelte';
    import PostIcon from '@cf/icons/post.svg';
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
                vis
            </Button>
        </div>
    </div>
    <input type="text" id="" placeholder="content warning"/>
    <textarea placeholder="what's cooking, mae?" class="textbox"></textarea>
    <div class="composer-footer">
        <div>
            <Button centered={true}>
                media
            </Button>
            <Button centered={true}>
                poll
            </Button>
            <Button centered={true}>
                cw
            </Button>
        </div>
        <Button filled={true} centered={true} class="postbtn">
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
