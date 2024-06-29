import { error } from '@sveltejs/kit';

export function load(event) {
    error(404, 'Not Found');
}
