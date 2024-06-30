<script>
    import { play_sound } from '../../sound.js';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let type = "react";
    export let label = "React";
    export let title = label;
    export let count = 0;
    export let active = false;
    export let disabled = false;
    export let sound = "default";

    function click() {
        play_sound(sound);
        dispatch('click');
    }
</script>

<button
    type="button"
    class={[
        type,
        active ? "active" : "",
        disabled ? "disabled" : "",
        ].join(' ')}
    aria-label="{label}"
    title="{title}"
    on:click={click}>
        <span class="icon">
            <slot/>
        </span>
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
        transition: background-color .1s, color .1s;
        cursor: pointer;
    }

    button.active {
        background-color: color-mix(in srgb, transparent, var(--accent) 50%);
        color: var(--bg-1000);
    }

    button:not(.disabled):hover {
        background-color: var(--bg-600);
        color: var(--text);
    }

    button:not(.disabled):active {
        background-color: var(--bg-1000);
        color: var(--text);
    }

    button.disabled {
        cursor: initial;
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
