<script>
    import '$lib/app.css';
    import LogoLight from '$lib/../img/spacesocial-logo-light.svg';
    import LogoDark from '$lib/../img/spacesocial-logo-dark.svg';
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
