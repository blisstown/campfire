export async function load({ url }) {
    return {
        code: url.searchParams.get("code") || false
    };
}
