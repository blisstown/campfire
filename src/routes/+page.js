import Feed from '$lib/ui/Feed.svelte';
import { Client } from '$lib/client/client.js';
import Button from '$lib/ui/Button.svelte';
import { get } from 'svelte/store';

export const prerender = true;
export const ssr = false;

export async function load() {
    let client = get(Client.get());
    await client.verifyCredentials();
    return { 
        client: client
    };
}
