<script>
    import Navigation from '$lib/ui/Navigation.svelte';
    import Widgets from '$lib/ui/Widgets.svelte';
</script>

<div id="spacesocial-app">

    <header>
        <Navigation />
    </header>

    <main>
        <slot></slot>
    </main>

    <div id="widgets">
        <Widgets />
    </div>

</div>
