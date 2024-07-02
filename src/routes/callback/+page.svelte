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

            get(client).getClientUser().then(user => {
                if (user) client.update(client => {
                    client.user = user
                    return client;
                });

                return get(client).getNotifications(
                    get(last_read_notification_id)
                ).then(notif_data => {
                    client.update(client => {
                        // we've just logged in, so assume all past notifications are read.
                        // i *would* just use the mastodon marker API to get the last read
                        // notification, but this does not appear to be widely supported.
                        if (notif_data.constructor === Array && notif_data.length > 0)
                            last_read_notification_id.set(notif_data[0].id);
                        client.save();
                        return client;
                    });
                    goto("/");
                });
            });
        });
    }
</script>
