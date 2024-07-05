/**
 * GET /api/v1/instance
 * @param {string} host - The domain of the target server.
 */
export async function getInstance(host) {
    const data = await fetch(`https://${host}/api/v1/instance`)
        .then(res => res.json())
        .catch(error => console.error(error));
    return data ? data : false;
}

/**
 * POST /api/v1/apps
 * Attempts to create an application for a given server host.
 * @param {string} host - The domain of the target server.
 */
export async function createApp(host) {
    let form = new FormData();
    form.append("client_name", "Campfire");
    form.append("redirect_uris", `${location.origin}/callback`);
    form.append("scopes", "read write push");
    form.append("website", "https://campfire.bliss.town");

    const res = await fetch(`https://${host}/api/v1/apps`, {
        method: "POST",
        body: form,
    })
    .then(res => res.json())
    .catch(error => {
        console.error(error);
        return false;
    });

    if (!res || !res.client_id) return false;

    return {
        id: res.client_id,
        secret: res.client_secret,
    };
}

/**
 * Returns the OAuth authorization url for the target server.
 * @param {string} host - The domain of the target server.
 * @param {string} app_id - The application id for the target server.
 */
export function getOAuthUrl(host, app_id) {
    return `https://${host}/oauth/authorize` +
        `?client_id=${app_id}` +
        "&scope=read+write+push" +
        `&redirect_uri=${location.origin}/callback` +
        "&response_type=code";
}

/**
 * POST /oauth/token
 * Attempts to generate an OAuth token.
 * Returns false on failure.
 * @param {string} host - The domain of the target server.
 * @param {string} client_id - The application id.
 * @param {string} secret - The application secret.
 * @param {string} code - The authorization code provided by OAuth.
 */
export async function getToken(host, client_id, secret, code) {
    let form = new FormData();
    form.append("client_id", client_id);
    form.append("client_secret", secret);
    form.append("redirect_uri", `${location.origin}/callback`);
    form.append("grant_type", "authorization_code");
    form.append("code", code);
    form.append("scope", "read write push");

    const res = await fetch(`https://${host}/oauth/token`, {
        method: "POST",
        body: form,
    })
    .then(res => res.json())
    .catch(error => {
        console.error(error);
        return false;
    });

    if (!res || !res.access_token) return false;

    return res.access_token;
}

/**
 * POST /oauth/revoke
 * Attempts to revoke an OAuth token.
 * Returns false on failure.
 * @param {string} host - The domain of the target server.
 * @param {string} client_id - The application id.
 * @param {string} secret - The application secret.
 * @param {string} token - The application token.
 */
export async function revokeToken(host, client_id, secret, token) {
    let form = new FormData();
    form.append("client_id", client_id);
    form.append("client_secret", secret);
    form.append("token", token);

    const res = await fetch(`https://${host}/oauth/revoke`, {
        method: "POST",
        body: form,
    })
    .catch(error => {
        console.error(error);
        return false;
    });

    if (!res.ok) return false;
    return true;
}

/**
 * GET /api/v1/accounts/verify_credentials
 * This endpoint returns information about the client account,
 * and other useful data.
 * Returns false on failure.
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 */
export async function verifyCredentials(host, token) {
    let url = `https://${host}/api/v1/accounts/verify_credentials`;
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + token }
    }).then(res => res.json());

    return data;
}

/**
 * GET /api/v1/streaming/health
 * Checks if the server's streaming service is alive
 */
export async function getStreamingHealth(host) {
    let url = `https://${host}/api/v1/streaming/health`;
    const res = await fetch(url, {
        method: 'GET'
    });

    return res.ok;
}

/**
 * GET /api/v1/notifications
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} min_id - If provided, only shows notifications after this ID.
 * @param {string} limit - The maximum number of notifications to retrieve (default 40).
 * @param {string} types - A list of notification types to filter to.
 */
export async function getNotifications(host, token, min_id, limit, types) {
    let url = `https://${host}/api/v1/notifications`;

    let params = new URLSearchParams();
    if (min_id) params.append("min_id", min_id);
    if (limit) params.append("limit", limit);
    if (types) params.append("types", types.join(','));
    const params_string = params.toString();
    if (params_string) url += '?' + params_string;

    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": "Bearer " + token }
    }).then(res => res.json());

    return data;
}

/**
 * GET /api/v1/timelines/{timeline}
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} timeline - The name of the timeline to pull (default "home").
 * @param {string} max_id - If provided, only shows posts after this ID.
 */
export async function getTimeline(host, token, timeline, max_id) {
    let url = `https://${host}/api/v1/timelines/${timeline || "home"}`;

    let params = new URLSearchParams();
    if (max_id) params.append("max_id", max_id);
    const params_string = params.toString();
    if (params_string) url += '?' + params_string;
    
    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": token ? `Bearer ${token}` : null }
    }).then(res => res.json());

    return data;
}

/**
 * GET /api/v1/statuses/{post_id}.
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to fetch.
 */
export async function getPost(host, token, post_id) {
    let url = `https://${host}/api/v1/statuses/${post_id}`;

    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": token ? `Bearer ${token}` : null }
    }).then(res => res.json())

    if (!data || data.error) return false;

    return data;
}

/**
 * POST /api/v1/statuses
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token
 * @param {any} post_data - The post content
 */
export async function createPost(host, token, post_data) {
    let formdata = new FormData();
    for (const key in post_data) {
        formdata.append(key, post_data[key]);
    }

    let url = `https://${host}/api/v1/statuses`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
        body: formdata
    })

    return await data.json()
}

/**
 * PUT /api/v1/statuses/{post_id}
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token
 * @param {any} post_id - The ID of the post to edit.
 * @param {any} post_data - The post content
 */
export async function editPost(host, token, post_id, post_data) {
    let formdata = new FormData();
    for (const key in post_data) {
        formdata.append(key, post_data[key]);
    }

    let url = `https://${host}/api/v1/statuses/${post_id}`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
        body: formdata
    })

    return await data.json()
}

/**
 * DELETE /api/v1/statuses/{post_id}
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token
 * @param {any} post_id - The ID of the post to delete.
 */
export async function deletePost(host, token, post_id) {
    let url = `https://${host}/api/v1/statuses/${post_id}`;
    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
    })

    return await data.json()
}

/**
 * GET /api/v1/statuses/{post_id}/context.
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to fetch.
 */
export async function getPostContext(host, token, post_id) {
    let url = `https://${host}/api/v1/statuses/${post_id}/context`;

    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": token ? `Bearer ${token}` : null }
    }).then(res => res.json());

    return data;
}

/**
 * POST /api/v1/statuses/{post_id}/reblog.
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to boost.
 */
export async function boostPost(host, token, post_id) {
    let url = `https://${host}/api/v1/statuses/${post_id}/reblog`;

    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
    }).then(res => res.json());

    return data;
}

/**
 * POST /api/v1/statuses/{post_id}/unreblog.
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to unboost.
 */
export async function unboostPost(host, token, post_id) {
    let url = `https://${host}/api/v1/statuses/${post_id}/unreblog`;

    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
    }).then(res => res.json());

    return data;
}

/**
 * POST /api/v1/statuses/{post_id}/favourite.
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to favourite.
 */
export async function favouritePost(host, token, post_id) {
    let url = `https://${host}/api/v1/statuses/${post_id}/favourite`;

    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
    }).then(res => res.json());

    return data;
}

/**
 * POST /api/v1/statuses/{post_id}/unfavourite.
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to unfavourite.
 */
export async function unfavouritePost(host, token, post_id) {
    let url = `https://${host}/api/v1/statuses/${post_id}/unfavourite`;

    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
    }).then(res => res.json());

    return data;
}

/**
 * POST /api/v1/statuses/{post_id}/react/{shortcode}
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to favourite.
 * @param {string} shortcode - The shortcode of the emote to react with.
 */
export async function reactPost(host, token, post_id, shortcode) {
    // note: reacting with foreign emotes is unsupported on most servers
    // chuckya appears to allow this, but other servers tested have
    // not demonstrated this.
    let url = `https://${host}/api/v1/statuses/${post_id}/react/${encodeURIComponent(shortcode)}`;

    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
    }).then(res => res.json());

    return data;
}

/**
 * POST /api/v1/statuses/{post_id}/unreact/{shortcode}
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} post_id - The ID of the post to favourite.
 * @param {string} shortcode - The shortcode of the reaction emote to remove.
 */
export async function unreactPost(host, token, post_id, shortcode) {
    let url = `https://${host}/api/v1/statuses/${post_id}/unreact/${encodeURIComponent(shortcode)}`;

    const data = await fetch(url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
    }).then(res => res.json());

    return data;
}

/**
 * GET /api/v1/accounts/{user_id}
 * @param {string} host - The domain of the target server.
 * @param {string} token - The application token.
 * @param {string} user_id - The ID of the user to fetch.
 */
export async function getUser(host, token, user_id) {
    let url = `https://${host}/api/v1/accounts/${user_id}`;

    const data = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": token ? `Bearer ${token}` : null }
    }).then(res => res.json());

    return data;
}
