<script>
    import Navigation from '$lib/ui/Navigation.svelte';
    import Widgets from '$lib/ui/Widgets.svelte';
    import Button from '$lib/ui/Button.svelte';
</script>

<div id="spacesocial-app">

    <header>
        <Navigation />
    </header>

    <main>
        <header>
            <h1>Home</h1>
            <nav>
                <Button centered active>Home</Button>
                <Button centered disabled>Local</Button>
                <Button centered disabled>Federated</Button>
            </nav>
        </header>

        <slot></slot>
    </main>

    <div id="widgets">
        <Widgets />
    </div>

</div>

<style>
    main header {
        width: 100%;
        margin: 16px 0 8px 0;
        display: flex;
        flex-direction: row;
    }

    main header h1 {
        font-size: 1.5em;
    }

    main header nav {
        margin-left: auto;
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
</style>
