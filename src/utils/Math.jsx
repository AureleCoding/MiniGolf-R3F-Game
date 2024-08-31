export function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export function easeInCirc(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

export function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

export function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInOutExpo(x) {
    return x === 0
        ? 0
        : x === 1
            ? 1
            : x < 0.5
                ? Math.pow(2, 20 * x - 10) / 2
                : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

export function oscillate(from, to, delta, duration = 1) {
    const progress = (Math.sin((delta / duration) * Math.PI) + 1) / 2;
    return Math.max(from, from + (to - from) * progress);
}