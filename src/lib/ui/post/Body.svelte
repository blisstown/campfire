<script>
    export let post;

    let open_warned = false;
</script>

<div class="post-body">
    {#if post.warning}
        <button class="post-warning" on:click|stopPropagation={() => { open_warned = !open_warned }} on:mouseup|stopPropagation>
        <strong>
            {post.warning}
            <span class="warning-instructions">
                {#if !open_warned}
                    (click to reveal)
                {:else}
                    (click to hide)
                {/if}
            </span>
        </strong>
        </button>
    {/if}
    {#if !post.warning || open_warned}
        {#if post.rich_text}
            <span class="post-text">{@html post.rich_text}</span>
        {:else if post.html}
            <span class="post-text">{@html post.html}</span>
        {/if}
        {#if post.media && post.media.length > 0}
            <div class="post-media-container" data-count={post.media.length}>
                {#each post.media as media}
                    <div class="post-media {media.type}" on:click|stopPropagation on:mouseup|stopPropagation>
                        {#if ["image", "gifv", "gif"].includes(media.type)}
                            <a href={media.url} target="_blank">
                                <img src={media.url} alt={media.description} title={media.description} height="200" loading="lazy" decoding="async">
                            </a>
                        {:else if media.type === "video"}
                            <video controls height="200">
                                <source src={media.url} alt={media.description} title={media.description} type={media.url.endsWith('.mp4') ? 'video/mp4' : 'video/webm'}>
                                <p>{media.description} &ensp; <a href={media.url}>[link]</a></p>
                                <!-- <media src={media.url} alt={media.description} loading="lazy" decoding="async"> -->
                            </video>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
        {#if post.boost && post.text}
            <p class="post-warning"><strong>this is quoting a post! quotes are not supported yet.</strong></p>
            <!-- TODO: quotes support -->
        {/if}
    {/if}
</div>

<style>
    .post-body {
        margin-top: 10px;
    }

    .post-warning {
        width: 100%;
        margin-bottom: 10px;
        padding: 4px 8px;
        --warn-bg: color-mix(in srgb, var(--bg-700), var(--accent) 1%);
        background: repeating-linear-gradient(-45deg, transparent, transparent 10px, var(--warn-bg) 10px, var(--warn-bg) 20px);
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        text-align: left;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        outline-color: var(--warn-bg);
        transition: outline .05s, box-shadow .05s;
    }

    .post-warning:hover {
        outline: 1px solid var(--warn-bg);
        box-shadow: 0 0 8px var(--warn-bg);
    }

    .post-warning .warning-instructions {
        font-weight: normal;
        opacity: .5;
    }

    .post-text {
        font-size: .9em;
        line-height: 1.45em;
        word-wrap: break-word;
    }

    .post-text :global(.emoji) {
        transition: transform .1s ease-out;
    }

    .post-text :global(.emoji):hover {
        transform: scale(1.2);
    }

    .post-text :global(blockquote) {
        margin: .4em 0;
        padding: .1em 0 .1em 1em;
        border-left: 4px solid #8888;
    }

    .post-text :global(blockquote span) {
        opacity: .5;
    }

    .post-text :global(code) {
        font-size: 1.2em;
    }

    .post-text :global(pre:has(code)) {
        margin: 8px 0;
        padding: 8px;
        display: block;
        overflow-x: scroll;
        border-radius: 8px;
        background-color: #080808;
        color: var(--accent);
    }

    .post-text :global(pre code) {
        margin: 0;
    }

    .post-text :global(a) {
        color: var(--accent);
    }

    .post-text :global(a.mention) {
        color: inherit;
        font-weight: 600;
        padding: 3px 6px;
        background: var(--bg-700);
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
        margin: 16px 0 4px 0;
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

    .post-media img,
    .post-media video {
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
