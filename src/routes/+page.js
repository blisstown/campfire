export const prerender = true;
export const ssr = false;

export async function load({ url }) {
    return { path: url.pathname };
}
