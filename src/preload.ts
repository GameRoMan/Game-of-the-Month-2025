import januaryLogo from './games/january/logo.webp';

const preloaded = [];
function preloadImage(src: string) {
    const image = new Image();
    image.src = src;
    preloaded.push(image);
}

export function preload() {
    preloadImage(januaryLogo);
}
