import { writable } from 'svelte/store';
import { app_name } from '$lib/config.js';
import { browser } from "$app/environment";

// if app is falsy, assume user has not begun the login process.
// if app.token is falsy, assume user has not logged in.
export const app = writable(loadApp());

// write to localStorage on each update
app.subscribe(app => {
    saveApp(app);
});

/**
 * Saves the provided app to localStorage.
 * If `app` is falsy, data is removed from localStorage.
 * @param {Object} app
 */
function saveApp(app) {
    if (!browser) return;
    if (!app) {
        localStorage.removeItem(app_name + "_app");
        return;
    }
    localStorage.setItem(app_name + "_app", JSON.stringify(app));
}

/**
 * Returns application data loaded from localStorage, if it exists.
 * Otherwise, returns false.
 */
function loadApp() {
    if (!browser) return;
    let data = localStorage.getItem(app_name + "_app");
    if (!data) return false;
    return JSON.parse(data);
}
