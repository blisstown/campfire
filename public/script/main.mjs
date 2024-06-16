const aria_safe_regex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|[\r])/g;
const INSTANCE_URL = "soc.arimelody.me";

const sounds = {
    "default": new Audio("sound/log.ogg"),
    "post": new Audio("sound/success.ogg"),
    "boost": new Audio("sound/hello.ogg"),
};

const actors = {
    "@ari": {
        "url": "https://soc.arimelody.me/@ari",
        "name": "ari 💫",
        "avatar": "avatar/ari.jpg",
    }
};

const test_post = {
    "context": {
        "type": "boost",
        "by": "@ari",
        "at": 1718513838624,
    },
    "author": "@ari",
    "url": "/post/21c892b23701",
    "at": 1718513988384,
    "content": "hello world!~",
    "media": [
        { "url": "media/ariyeah-button.png", "alt": "custom miiverse \"yeah!\" button" },
        { "url": "media/beer.jpg", "alt": "barney calhoun with beer" },
        { "url": "media/duck.jpg", "alt": "big rubber duck" },
    ],
    "replies": 7,
    "boosts": 13,
    "reactions": [
        { "react": "⭐", "count": "52" },
        { "react": "❤️", "count": "9" },
    ],
};

const feed = document.getElementById("feed");

function render_post(data) {
    // TODO: please god just use or make a library to build this

    const actor = actors[data.author];
    if (!actor) return;
    const date = new Date(data.at);

    const post = document.createElement("article");
    post.classList.add("post-container");
    post.ariaLabel = actor.name.replace(aria_safe_regex, "").trim() + "; " + data.content + "; " + date.toLocaleTimeString();

    if (data.context && data.context.by && actors[data.context.by]) {
        // post context
        const post_context = document.createElement("div");
        post_context.classList.add("post-context");

        if (data.context.type == "boost") {
            const post_context_icon = document.createElement("span");
            post_context_icon.classList.add("post-context-icon");
            post_context_icon.innerText = "🔁";
            post_context.appendChild(post_context_icon);

            const post_context_action = document.createElement("span");
            post_context_action.classList.add("post-context-action");
            const actor = actors[data.context.by];
            post_context_action.innerHTML = `boosted by <a href="${actor.url}">${actor.name}</a>`;
            post_context.appendChild(post_context_action);

            const post_context_time = document.createElement("span");
            post_context_time.classList.add("post-context-time");
            post_context_time.innerHTML = `<time>${new Date(data.context.at).toLocaleString()}</time>`;
            post_context.appendChild(post_context_time);
        }

        post.appendChild(post_context);
    }

    // the actual post
    // article.post
    const post_article = document.createElement("article");

    const post_header_container = document.createElement("div");
    post_header_container.classList.add("post-header-container");
    const post_avatar_container = document.createElement("a");
    post_avatar_container.classList.add("post-avatar-container");
    post_avatar_container.href = actor.url;
    const post_avatar = document.createElement("img");
    post_avatar.classList.add("post-avatar");
    post_avatar.src = actor.avatar;
    post_avatar.alt = "";
    post_avatar.width = 48;
    post_avatar.height = 48;
    post_avatar.loading = "lazy";
    post_avatar.decoding = "async";
    post_avatar_container.appendChild(post_avatar);
    post_header_container.appendChild(post_avatar_container);

    const post_header = document.createElement("header");
    post_header.classList.add("post-header");
    const post_user_info = document.createElement("div");
    post_user_info.classList.add("post-user-info");
    const post_user_info_name = document.createElement("a");
    post_user_info_name.classList.add("name");
    post_user_info_name.href = actor.url;
    post_user_info_name.innerText = actor.name
    post_user_info.appendChild(post_user_info_name);
    const post_user_info_username = document.createElement("span");
    post_user_info_username.classList.add("username");
    post_user_info_username.href = actor.url;
    post_user_info_username.innerText = data.author
    post_user_info.appendChild(post_user_info_username);
    post_header.appendChild(post_user_info);
    const post_info = document.createElement("div");
    post_info.classList.add("post-info");
    const post_info_time = document.createElement("a");
    post_info_time.classList.add("created-at");
    const post_date = new Date(data.at);
    post_info_time.innerHTML = `<time title=${post_date.toLocaleString()}>${post_date.toLocaleString()}</time>`;
    post_info_time.href = post.url;
    post_info.appendChild(post_info_time);
    post_header.appendChild(post_info);
    post_header_container.appendChild(post_header);

    post_article.appendChild(post_header_container);


    const post_body = document.createElement("div");
    post_body.classList.add("post-body");

    const post_content = document.createElement("span");
    post_content.classList.add("post-content");
    post_content.innerText = data.content;
    post_body.appendChild(post_content);

    const media_container = document.createElement("div");
    media_container.classList.add("post-media-container");
    media_container.dataset.count = data.media.length;
    data.media.forEach(media => {
        const media_item = document.createElement("div");
        media_item.classList.add("post-media");
        const link = document.createElement("a");
        link.href = media.url;
        const source = document.createElement("img");
        source.src = media.url;
        source.alt = media.alt;
        source.loading = "lazy";
        source.decoding = "async";
        link.appendChild(source);
        media_item.appendChild(link);
        media_container.appendChild(media_item);
    });
    post_body.appendChild(media_container);

    post_article.appendChild(post_body);


    const post_footer = document.createElement("footer");
    post_footer.classList.add("post-footer");

    const post_reactions = document.createElement("div");
    post_reactions.classList.add("post-reactions");
    data.reactions.forEach(reaction => {
        const btn = document.createElement("button");
        btn.classList.add("reaction");
        btn.type = "button";
        const emote = document.createElement("span");
        emote.innerText = reaction.react;
        btn.appendChild(emote);
        const count = document.createElement("span");
        count.classList.add("count");
        count.innerText = reaction.count;
        btn.appendChild(count);
        post_reactions.appendChild(btn);
    });
    post_footer.appendChild(post_reactions);

    const post_actions = document.createElement("div");
    post_actions.classList.add("post-actions");

    const reply_button = document.createElement("button");
    reply_button.type = "button";
    reply_button.ariaLabel = "Reply";
    reply_button.title = "Reply";
    reply_button.innerHTML = `<span>🗨️</span><span class="count">${data.replies}</count>`;
    post_actions.appendChild(reply_button);

    const boost_button = document.createElement("button");
    boost_button.type = "button";
    boost_button.ariaLabel = "Boost";
    boost_button.title = "Boost";
    boost_button.innerHTML = `<span>🔁</span><span class="count">${data.boosts}</count>`;
    post_actions.appendChild(boost_button);

    const fav_button = document.createElement("button");
    fav_button.type = "button";
    fav_button.ariaLabel = "Favourite";
    fav_button.title = "Favourite";
    fav_button.innerText = "⭐";
    post_actions.appendChild(fav_button);

    const react_button = document.createElement("button");
    react_button.type = "button";
    react_button.ariaLabel = "React";
    react_button.title = "React";
    react_button.innerText = "😃";
    post_actions.appendChild(react_button);

    const quote_button = document.createElement("button");
    quote_button.type = "button";
    quote_button.ariaLabel = "Quote";
    quote_button.title = "Quote";
    quote_button.innerText = "🗣️";
    post_actions.appendChild(quote_button);

    const more_button = document.createElement("button");
    more_button.type = "button";
    more_button.ariaLabel = "More";
    more_button.title = "More";
    more_button.innerText = "⚒️";
    post_actions.appendChild(more_button);

    post_footer.appendChild(post_actions);

    post_article.appendChild(post_footer);


    post.appendChild(post_article);

    return post;
};

function hook_post_listeners(post) {
    post.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("reaction")) {
                toggle_reaction(button);
            }

            switch (button.ariaLabel) {
                case "Reply":
                    play_sound("post");
                    break;

                case "Boost":
                    play_sound("boost");
                    break;

                case "Favourite":
                    post.querySelectorAll("button.reaction").forEach(reaction => {
                        if (!reaction.innerText.startsWith("⭐")) return;
                        toggle_reaction(reaction);
                    });
                    play_sound();
                    break;

                default:
                    play_sound();
                    break;
            }
        });       
    });
}

function toggle_reaction(reaction) {
    const was_active = reaction.classList.contains("active");
    reaction.classList.toggle("active");
    const count = reaction.querySelector(".count");
    count.innerText = Number(count.innerText) + (was_active ? -1 : 1);
}

function load_content() {
    for (let i = 0; i < 10; i++) {
        const post = render_post(test_post);
        feed.appendChild(post);
        hook_post_listeners(post);
    }
}

function play_sound(name) {
    if (!name) name = "default";
    const sound = sounds[name];
    if (!sound) {
        console.warn(`Attempted to play sound "${name}", which does not exist!`);
        return;
    }
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

feed.querySelectorAll(".post-container").forEach(post => {
    hook_post_listeners(post);
});
load_content();

document.addEventListener("scroll", event => {
    while (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        load_content();
    }
});
