<script>
    import { beforeUpdate } from "svelte";
    export let visible = true;
    export let centered = false;

    beforeUpdate(() => {
        // disable scrolling hack: this has to be on body
        if(visible) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "scroll";
        }
    })
</script>

{#if visible}
    <div class="overlay" on:click={() => visible = !visible}></div>
    <div class="container">
        <div class="modal" class:modal-top={!centered} class:modal-center={centered}>
            <slot/>
        </div>
    </div>
{/if}

<style>
    .container {
        z-index: 101;
        display: flex;
        justify-content: center;
        position: absolute;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
    }

    .modal {
        background-color: var(--bg-800);
        z-index: 101;

        padding: 16px;
        width: 732px;
        border-radius: 8px;
        box-shadow: 0px 16px 64px 4px rgba(0,0,0,0.5);
        animation: modal_pop_up .15s cubic-bezier(0.22, 1, 0.36, 1);
        height: fit-content;

        pointer-events: all;
    }

    .overlay {
        width: 100vw;
        height: 100vw;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        
        background-color: rgba(0,0,0,0.5);
        backdrop-filter: blur(10px) saturate(1.25);
        user-select: none;

        animation: modal_bg .15s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .modal-top {
        margin-top: 8em;
    }

    .modal-center {
        align-items: center;
    }

    @keyframes modal_bg {
        from {
            background-color: rgba(0,0,0,0);
            backdrop-filter: blur(0px) saturate(1.0);
        }
        /*
        to {
            background-color: rgba(0,0,0,0.5);
            backdrop-filter: blur(10px) saturate(1.25);
        }
        */
    }

    @keyframes modal_pop_up {
        from {
            opacity: 0%;
            transform: translateY(16px) scale(0.95);
        }

        to {
            opacity: 100%;
            transform: translateY(0px) scale(1);
        }
    }
</style>
