<script>
    import { client } from '$lib/client/client.js';
    import { goto } from '$app/navigation';
    import { error } from '@sveltejs/kit';
    import { get } from 'svelte/store';
    import { last_read_notif_id } from '$lib/notifications.js';
    import { logged_in, user, getUser } from '$lib/stores/user.js';

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

            getUser().then(new_user => {
                if (!new_user) return;

                logged_in.set(true);
                user.set(new_user);

                return get(client).getNotifications(
                    get(last_read_notif_id)
                ).then(notif_data => {
                    if (notif_data.constructor === Array && notif_data.length > 0)
                        last_read_notif_id.set(notif_data[0].id);
                    get(client).save();
                    goto("/");
                });
            });
        });
    }
</script>
