import { writable } from 'svelte/store';

export let user = writable(0);
export let logged_in = writable(false);
