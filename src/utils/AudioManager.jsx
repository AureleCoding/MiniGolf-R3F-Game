export const audios = {
    hit: new Audio("audios/sfx/hit.mp3"),
    hole: new Audio("audios/sfx/hole.mp3"),
    music: new Audio("audios/music/music.mp3"),
    win: new Audio("audios/sfx/win.mp3"),
};

export const playAudio = (audio, loop = false) => {
    audio.loop = loop;
    audio.currentTime = 0;
    audio.play().catch((error) => {
        console.error('Audio playback failed:', error);
    });
};

export const stopAudio = (audio) => {
    audio.currentTime = 0;
    audio.pause();
};