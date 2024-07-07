import { error } from '@sveltejs/kit';

export async function load({ params }) {
    return error(404, 'Not Found');
    // return {
    //     account_name: params.account
    // };
}
