import { writable } from 'svelte/store';

export let account = writable(false);
export let logged_in = writable(false);
