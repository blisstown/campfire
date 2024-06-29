let sounds;

if (typeof Audio !== typeof undefined) {
    sounds = {
        "default": new Audio("/sound/log.ogg"),
        "post": new Audio("/sound/success.ogg"),
        "boost": new Audio("/sound/hello.ogg"),
    };
}

export function play_sound(name) {
    if (name === false) return;
    if (!name) name = "default";
    const sound = sounds[name];
    if (!sound) {
        console.warn(`Attempted to play sound "${name}", which does not exist!`);
        return;
    }
    sound.pause();
    sound.volume = 0.25;
    sound.currentTime = 0;
    sound.play();
}
