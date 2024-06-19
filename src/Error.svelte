<script>
    export let msg = "";
    export let trace = "";
</script>

<div class="error">
    {#if msg}
        <p class="msg">{@html msg}</p>
    {/if}
    {#if trace}
        <pre class="trace">{trace}</pre>
    {/if}
    <slot></slot>
</div>

<style>
    .error {
        margin-top: 16px;
        padding: 20px 32px;
        border: 1px solid #8884;
        border-radius: 16px;
        background-color: var(--bg1);
    }
</style>
