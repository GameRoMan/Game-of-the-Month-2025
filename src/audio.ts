export const audioContext = new window.AudioContext();

export const musicGain = audioContext.createGain();
export const soundEffectsGain = audioContext.createGain();

musicGain.connect(audioContext.destination);
soundEffectsGain.connect(audioContext.destination);

export function setupSoundEffect(src: string) {
    const audio = new Audio(src);
    const node = audioContext.createMediaElementSource(audio);
    node.connect(soundEffectsGain);
    return audio;
}

// Music needs to be setup through a buffer so it loops seamlessly
// Inspired by https://jackyef.com/posts/building-an-audio-loop-player-on-the-web
export function setupMusic(src: string) {
    async function downloadAndDecode() {
        const arrayBuffer = await fetch(src).then(res => res.arrayBuffer());
        return await audioContext.decodeAudioData(arrayBuffer);
    }

    const promise = downloadAndDecode();

    let blurred = false;
    let stopped = true;
    let source: AudioBufferSourceNode | undefined = undefined;

    const controls = {
        play() {
            if (!document.hasFocus()) {
                blurred = true;
                return;
            }

            stopped = false;
            promise.then(decoded => {
                if (stopped) return;
                source = audioContext.createBufferSource();
                source.buffer = decoded;
                source.loop = true;
                source.connect(musicGain);
                source.start();
            });
        },
        pause() {
            stopped = true;
            if (source === undefined) return;
            source.stop();
            source = undefined;
        },
    };

    window.addEventListener('blur', () => {
        if (!stopped) {
            controls.pause();
            blurred = true;
        }
    });

    window.addEventListener('focus', () => {
        if (blurred) {
            controls.play();
            blurred = false;
        }
    });

    return controls;
}
