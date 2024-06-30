<div id="widgets">
    <input type="text" id="search" placeholder="Search">
</div>

<style>
    #widgets {
        position: fixed;
        top: 16px;
        width: 300px;
        height: calc(100vh - 32px);

        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    #search {
        padding: 16px;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, transparent, var(--accent) 25%);
        background-color: var(--bg-800);

        font-family: inherit;
        font-weight: 600;
        font-size: inherit;
        color: var(--text);

        transition: box-shadow .2s;
    }

    #search::placeholder {
        opacity: .8;
    }

    #search:focus {
        outline: none;
        box-shadow: 0 0 16px color-mix(in srgb, transparent, var(--accent) 25%);
    }
</style>
