<script>
    import { play_sound } from '../sound.js';

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
        on:click={() => (play_sound(sound))}>
        <span>{@html icon}</span>
        {#if count}
            <span class="count">{count}</span>
        {/if}
</button>

<style>
    button {
        padding: 6px 8px;
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

    .count {
        opacity: .5;
    }

    button:hover .count {
        opacity: 1;
    }
</style>
