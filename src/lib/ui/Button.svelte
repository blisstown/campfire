<script>
    import { play_sound } from '../sound.js';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let active = false;
    export let filled = false;
    export let disabled = false;
    export let centered = false;
    export let label = undefined;
    export let sound = "default";
    export let href = false;

    let classes = [];
    if (active) classes = ["active"];
    if (filled) classes = ["filled"];
    if (disabled) classes = ["disabled"];
    if (centered) classes.push("centered");

    function click() {
        if (disabled) return;
        if (href) {
            location = href;
            return;
        }
        play_sound(sound);
        dispatch('click');
    }
</script>

<button
        type="button"
        class={classes.join(' ')}
        title={label}
        aria-label={label}
        on:click={() => click()}>
    <span class="icon">
        <slot name="icon" />
    </span>
    <slot/>
</button>

<style>
    button {
        /* min-width: 64px; */
        width: 100%;
        height: 54px;
        padding: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;

        font-family: inherit;
        font-size: 1rem;
        font-weight: 600;
        text-align: left;

        border-radius: 8px;
        border-width: 2px;
        border-style: solid;

        background-color: var(--bg-700);
        color: var(--text);
        border-color: transparent;

        transition-property: border-color, background-color, color;
        transition-timing-function: ease-out;
        transition-duration: .1s;

        cursor: pointer;
    }

    button.centered {
        text-align: center;
        justify-content: center;
    }

    button:hover {
        background-color: color-mix(in srgb, var(--bg-700), var(--accent) 10%);
        border-color: color-mix(in srgb, var(--bg-700), var(--accent) 20%);
    }

    button:active {
        background-color: color-mix(in srgb, var(--bg-700), var(--bg-800) 50%);
        border-color: color-mix(in srgb, var(--bg-700), var(--bg-800) 10%);
    }

    button.active {
        background-color: var(--bg-600);
        color: var(--accent);
        border-color: var(--accent);
        text-shadow: 0px 2px 32px var(--accent);
    }

    button.active:hover {
        color: color-mix(in srgb, var(--accent), var(--bg-1000) 20%);
        border-color: color-mix(in srgb, var(--accent), var(--bg-1000) 20%);
        background-color: color-mix(in srgb, var(--bg-600), var(--accent) 10%);
    }

    button.active:active {
        color: color-mix(in srgb, var(--accent), var(--bg-800) 10%);
        border-color: color-mix(in srgb, var(--accent), var(--bg-800) 10%);
        background-color: color-mix(in srgb, var(--bg-600), var(--bg-800) 10%);
    }

    button.filled {
        background-color: var(--accent);
        color: var(--bg-800);
        border-color: transparent;
    }

    button.filled:hover {
        color: color-mix(in srgb, var(--bg-800), white 10%);
        background-color: color-mix(in srgb, var(--accent), white 20%);
    }

    button.filled:active {
        color: color-mix(in srgb, var(--bg-800), black 10%);
        background-color: color-mix(in srgb, var(--accent), black 20%);
    }

    button.disabled {
        background-color: var(--bg-700);
        color: var(--text);
        opacity: .5;
        border-color: transparent;
        cursor: initial;
    }

    button.disabled:hover {
    }

    button.disabled:active {
    }

    .icon:not(:empty) {
        height: 150%;
        margin-right: 8px;
    }

    .icon :global(svg) {
        height: 100%;
    }

    .centered .icon {
        margin-right: 0px;
    }
</style>
