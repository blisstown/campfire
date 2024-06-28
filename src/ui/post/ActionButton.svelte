<script>
    import { play_sound } from '../../sound.js';

    export let icon = "🔧";
    export let type = "action";
    export let label = "Action";
    export let title = label;
    export let count = 0;
    export let sound = "default";
</script>

<button
        type="button"
        class="{type}"
        aria-label="{label}"
        title="{title}"
        on:click|stopPropagation={() => (play_sound(sound))}>
        <span class="icon">{@html icon}</span>
        {#if count}
            <span class="count">{count}</span>
        {/if}
</button>

<style>
    button {
        height: 32px;
        padding: 6px 8px;
        display: flex;
        flex-direction: row;
        gap: 4px;
        font-size: 1em;
        background: none;
        color: inherit;
        border: none;
        border-radius: 8px;
    }

    button.active {
        background: var(--accent);
        color: var(--bg0);
    }

    button:hover {
        background: #8881;
    }

    button:active {
        background: #0001;
    }

    .icon {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .count {
        opacity: .5;
    }

    button:hover .count {
        opacity: 1;
    }
</style>
