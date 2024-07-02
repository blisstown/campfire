import { client } from '$lib/client/client.js';
import * as api from '$lib/client/api.js';
import { get, writable } from 'svelte/store';

export let notifications = writable([]);
export let unread_notif_count = writable(0);
export let last_read_notif_id = writable(0);

let loading;
export async function getNotifications() {
    if (loading) return; // no spamming!!
    loading = true;

    api.getNotifications().then(async data => {
        if (!data || data.length <= 0) return;
        notifications.set([]);
        for (let i in data) {
            let notif = data[i];
            notif.accounts = [ await api.parseUser(notif.account) ];
            if (get(notifications).length > 0) {
                let prev = get(notifications)[get(notifications).length - 1];
                if (notif.type === prev.type) {
                    if (prev.status && notif.status && prev.status.id === notif.status.id) {
                        notifications.update(notifications => {
                            notifications[notifications.length - 1].accounts.push(notif.accounts[0]);
                            return notifications;
                        });
                        continue;
                    }
                }
            }
            notif.status = await api.parsePost(notif.status, 0, false);
            notifications.update(notifications => [...notifications, notif]);
        }
        last_read_notif_id.set(data[0].id);
        unread_notif_count.set(0);
        get(client).save();
        loading = false;
    });
}
