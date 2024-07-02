import { client } from '$lib/client/client.js';
import * as api from '$lib/client/api.js';
import { get, writable } from 'svelte/store';

export let user = writable(0);
export let logged_in = writable(false);

export async function getUser() {
    // already known
    if (get(user)) return get(user);

    // cannot provide- not logged in
    if (!get(client).app || !get(client).app.token) return false;

    // logged in- attempt to retrieve using token
    const data = await api.verifyCredentials();
    if (!data) return false;

    user.set(await api.parseUser(data));
    console.log(`Logged in as @${get(user).username}@${get(user).host}`);
    return get(user);
}
