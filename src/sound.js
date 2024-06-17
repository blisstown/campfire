const sounds = {
    "default": new Audio("sound/log.ogg"),
    "post": new Audio("sound/success.ogg"),
    "boost": new Audio("sound/hello.ogg"),
};

export function play_sound(name) {
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
