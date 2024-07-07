export async function load({ params }) {
    return {
        server_host: params.server,
        account_handle: params.account,
        post_id: params.post
    };
}
