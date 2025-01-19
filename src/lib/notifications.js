import * as api from '$lib/api.js';
import { server } from '$lib/client/server.js';
import { app } from '$lib/client/app.js';
import { app_name } from '$lib/config.js';
import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { parsePost } from '$lib/post.js';
import { parseAccount } from '$lib/account.js';

const prefix = app_name + '_notif_';
const notification_limit = 40;

export const notifications = writable([]);
export const unread_notif_count = writable(load("unread_count"));
export const last_read_notif_id = writable(load("last_read"));

unread_notif_count.subscribe(count => save("unread_count", count));
last_read_notif_id.subscribe(id => save("last_read", id));

/**
 * Saves the provided data to localStorage.
 * If `data` is falsy, the record is removed from localStorage.
 * @param {Object} name
 * @param {any} data
 */
function save(name, data) {
    if (!browser) return;
    if (data) {
        localStorage.setItem(prefix + name, data);
    } else {
        localStorage.removeItem(prefix + name);
    }
}

/**
 * Returns named data loaded from localStorage, if it exists.
 * Otherwise, returns false.
 */
function load(name) {
    if (!browser) return;
    let data = localStorage.getItem(prefix + name);
    return data ? data : false;
}

export async function getNotifications(min_id, max_id) {
    const new_notifications = await api.getNotifications(
        get(server).host,
        get(app).token,
        min_id,
        max_id,
        notification_limit,
    );

    if (!new_notifications) {
        console.error(`Failed to retrieve notifications.`);
        loading = false;
        return;
    }

    for (let i in new_notifications) {
        let notif = new_notifications[i];
        notif.accounts = [ await parseAccount(notif.account) ];

        const _notifications = get(notifications);
        if (_notifications.length > 0) {
            let prev = _notifications[_notifications.length - 1];

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

        notif.status = notif.status ? await parsePost(notif.status, 0, false) : null;
        notifications.update(notifications => [...notifications, notif]);
    }
}
