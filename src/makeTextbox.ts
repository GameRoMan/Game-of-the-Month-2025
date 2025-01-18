import {randomInt} from './util.ts';
import {canvas, context, overlay, setOverlay} from './dom.ts';

export function makeTextbox(text: string, onClick?: () => void) {
    return () => {
        context.fillStyle = `hsl(${randomInt(0, 359)}, 50%, 40%)`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        setOverlay(`<h3 class="center">${text}</h3>`);
        if (onClick !== undefined) overlay.addEventListener('click', onClick);
        return () => {
            if (onClick !== undefined) overlay.removeEventListener('click', onClick);
        };
    };
}
