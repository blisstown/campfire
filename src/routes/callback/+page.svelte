<script>
    import { client } from '$lib/client/client.js';
    import { goto } from '$app/navigation';
    import { error } from '@sveltejs/kit';
    import { get } from 'svelte/store';

    export let data;

    let auth_code = data.code;

    if (!auth_code) {
        error(400, { message: "Bad request" });
    } else {
        get(client).getToken(auth_code).then(token => {
            if (!token) {
                error(400, { message: "Invalid auth code provided" });
                return;
            }

            client.update(c => {
                c.app.token = token;
                c.save();
                return c;
            });

            get(client).getUser().then(user => {
                if (user) client.update(client => {
                    client.user = user
                    return client;
                });
                goto("/");
            });
        });
    }
</script>
