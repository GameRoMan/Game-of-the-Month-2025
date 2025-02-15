export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function choice<T>(array: T[]) {
    return array[randomInt(0, array.length - 1)];
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function clamp(value: number, min: number, max: number) {
    return Math.max(Math.min(value, max), min);
}

function isCounterClockwise(l1x1: number, l1y1: number, l1x2: number, l1y2: number, l2x1: number, l2y1: number) {
    return (l2y1 - l1y1) * (l1x2 - l1x1) > (l1y2 - l1y1) * (l2x1 - l1x1);
}

export function linesIntersect(
    l1x1: number,
    l1y1: number,
    l1x2: number,
    l1y2: number,
    l2x1: number,
    l2y1: number,
    l2x2: number,
    l2y2: number,
) {
    // Inspired by https://stackoverflow.com/questions/3838329
    return (
        isCounterClockwise(l1x1, l1y1, l2x1, l2y1, l2x2, l2y2) !==
            isCounterClockwise(l1x2, l1y2, l2x1, l2y1, l2x2, l2y2) &&
        isCounterClockwise(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1) !==
            isCounterClockwise(l1x1, l1y1, l1x2, l1y2, l2x2, l2y2)
    );
}

export function isPointOnLine(
    a: {x: number; y: number},
    b: {x: number; y: number},
    point: {x: number; y: number},
    width: number,
) {
    // Inspired by a result from Google's overview
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lineLengthSquared = dx * dx + dy * dy;

    const t =
        lineLengthSquared > 0
            ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lineLengthSquared))
            : 0;
    const x = a.x + t * dx;
    const y = a.y + t * dy;

    return Math.sqrt((point.x - x) * (point.x - x) + (point.y - y) * (point.y - y)) <= width / 2;
}

function parseColor(color: string) {
    return color
        .slice(1)
        .match(/.{2}/g)!
        .map(value => parseInt(value, 16));
}

export function interpolateColor(a: string, b: string, amount: number) {
    return `rgb(${parseColor(a).map((value, i) => {
        const other = parseColor(b)[i];
        return Math.round(value + (other - value) * amount);
    })})`;
}
