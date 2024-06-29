import sound_log from '../sound/log.ogg';
import sound_hello from '../sound/hello.ogg';
import sound_success from '../sound/success.ogg';
let sounds;

if (typeof Audio !== typeof undefined) {
    sounds = {
        "default": new Audio(sound_log),
        "post": new Audio(sound_hello),
        "boost": new Audio(sound_success),
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
