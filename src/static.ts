import {canvas, context} from './dom.ts';
import {audioContext, soundEffectsGain} from './audio.ts';

export const VOLUME_REDUCTION = 15;
export const STATIC_DURATION = 250;

let state: {timeout: number; callback: () => void} | undefined = undefined;

export function startStatic(onComplete: () => void) {
    if (state === undefined) {
        requestAnimationFrame(fillStatic);
    } else {
        clearTimeout(state.timeout);
        state = undefined;
    }

    state = {
        timeout: setTimeout(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            onComplete();
            state = undefined;
        }, STATIC_DURATION),
        callback: onComplete,
    };

    playStaticAudio();
}

function fillStatic() {
    if (state === undefined) return;

    // Inspired by https://impossiblue.github.io/log/140528
    const width = canvas.width;
    const height = canvas.height;
    const image = context.createImageData(width, height);
    const buffer = new Uint32Array(image.data.buffer);
    for (let i = 0; i < buffer.length; ++i) buffer[i] = Math.random() < 0.5 ? 0xff000000 : 0xffffffff;
    context.putImageData(image, 0, 0);

    requestAnimationFrame(fillStatic);
}

function playStaticAudio() {
    // Inspired by https://codepen.io/2kool2/pen/xrLeMq
    const length = (audioContext.sampleRate * STATIC_DURATION) / 1000;
    const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) / VOLUME_REDUCTION;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(soundEffectsGain);
    source.start();
}
