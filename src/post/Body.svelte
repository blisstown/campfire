<script>
    export let post;
</script>

<div class="post-body">
    {#if post.warning}
        <p class="post-warning"><strong>{post.warning}</strong></p>
    {/if}
    {#if post.text}
        <span class="post-text">{@html post.rich_text}</span>
    {/if}
    <div class="post-media-container" data-count={post.files.length}>
        {#each post.files as file}
            <div class="post-media image">
                <a href={file.url}>
                    <img src={file.url} alt={file.alt} height="200" loading="lazy" decoding="async">
                </a>
            </div>
        {/each}
    </div>
    {#if post.boost && post.text}
        <p class="post-warning"><strong>this is quoting a post! quotes are not supported yet.</strong></p>
        <!-- TODO: quotes support -->
    {/if}
</div>

<style>
    .post-body {
        margin-top: 8px;
    }

    .post-warning {
        padding: 4px 8px;
        --warn-bg: rgba(255,220,30,.2);
        background-image: repeating-linear-gradient(-45deg, transparent, transparent 10px, var(--warn-bg) 10px, var(--warn-bg) 20px);
        border-radius: 8px;
    }

    .post-text {
        word-wrap: break-word;
    }

    .post-text :global(code) {
        font-size: 1.2em;
    }

    .post-text :global(code:has(pre)) {
        margin: 8px 0;
        padding: 8px;
        display: block;
        overflow-x: scroll;
        border-radius: 8px;
        background-color: #080808;
        color: var(--accent);
    }

    .post-text :global(code pre) {
        margin: 0;
    }

    .post-text :global(a) {
        color: var(--accent);
    }

    .post-text :global(a.mention) {
        color: var(--accent);
        padding: 6px 6px;
        margin: -6px 0;
        background: var(--accent-bg);
        border-radius: 6px;
        text-decoration: none;
    }

    .post-text :global(a.mention:hover) {
        text-decoration: underline;
    }

    .post-text :global(a.hashtag) {
        background-color: transparent;
        padding: 0;
        font-style: italic;
    }

    .post-text :global(.mention-avatar) {
        position: relative;
        top: 4px;
        height: 20px;
        margin-right: 4px;
        border-radius: 4px;
    }

    .post-media-container {
        max-height: 540px;
        margin-top: 8px;
        display: grid;
        grid-gap: 8px;
    }

    .post-media-container[data-count="1"] {
        grid-template-rows: 1fr;
    }

    .post-media-container[data-count="2"] {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
    }

    .post-media-container[data-count="3"] {
        grid-template-columns: 1fr .5fr;
        grid-template-rows: 1fr 1fr;
    }

    .post-media-container[data-count="4"] {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
    }

    .post-media {
        border-radius: 12px;
        background-color: #000;
        overflow: hidden;
    }

    .post-media a {
        width: 100%;
        height: 100%;
        display: block;
        cursor: zoom-in;
    }

    .post-media a img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
    }

    .post-media-container > :nth-child(1) {
        grid-column: 1/2;
        grid-row: 1/2;
    }

    .post-media-container[data-count="3"] > :nth-child(1) {
        grid-row: 1/3;
    }

    .post-media-container > :nth-child(2) {
        grid-column: 2/2;
        grid-row: 1/2;
    }

    .post-media-container > :nth-child(3) {
        grid-column: 1/2;
        grid-row: 2/2;
    }

    .post-media-container[data-count="3"] > :nth-child(3) {
        grid-column: 2/2;
        grid-row: 2/2;
    }

    .post-media-container > :nth-child(4) {
        grid-column: 2/2;
        grid-row: 2/2;
    }
</style>
