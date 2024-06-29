import { Client } from '$lib/client/client.js';
import { goto } from '$app/navigation';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const ssr = false;

export async function load({ params, url }) {
    const client = get(Client.get());
    let auth_code = url.searchParams.get("code");
    if (auth_code) {
        client.getToken(auth_code).then(() => {
            client.save();
            goto(url.origin);
        });
    }
    error(400, {
        message: "Bad request"
    });
}
