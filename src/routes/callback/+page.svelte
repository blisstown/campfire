<script>
    import * as api from '$lib/api.js';
    import { server } from '$lib/client/server.js';
    import { app } from '$lib/client/app.js';
    import { parseAccount } from '$lib/account.js';
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { error } from '@sveltejs/kit';
    import { unread_notif_count, last_read_notif_id } from '$lib/notifications.js';
    import { account } from '$lib/stores/account.js';

    export let data;

    let auth_code = data.code;

    if (!auth_code || !get(server) || !get(app)) {
        error(400, { message: "Bad request" });
    } else {
        api.getToken(get(server).host, get(app).id, get(app).secret, auth_code).then(token => {
            if (!token) {
                error(400, { message: "Invalid auth code provided" });
            }

            app.update(app => {
                app.token = token;
                return app;
            });

            api.verifyCredentials(get(server).host, get(app).token).then(data => {
                if (!data) return goto("/");

                account.set(parseAccount(data));
                console.log(`Logged in as @${get(account).username}@${get(account).host}`);

                // spin up async task to fetch notifications
                return api.getNotifications(
                    get(server).host,
                    get(app).token,
                    get(last_read_notif_id)
                ).then(notif_data => {
                    unread_notif_count.set(0);
                    if (notif_data.constructor === Array && notif_data.length > 0)
                        last_read_notif_id.set(notif_data[0].id);
                    goto("/");
                });
            });
        });
    }
</script>
