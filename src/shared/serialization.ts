// All visible ascii characters except for ` as that will be used to
// surround the string to prevent chat apps from treating it as markdown
const CHARACTERS = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~`;
const RADIX = CHARACTERS.length;

export function bigIntToString(int: bigint) {
    let result = '';
    while (int > 0) {
        let remainder = int % BigInt(RADIX);
        result = CHARACTERS[Number(remainder)] + result;
        int = int / BigInt(RADIX);
    }
    return result;
}

export function stringToBigInt(input: string) {
    let int = 0n;
    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);
        const parsed = parseInt(char, RADIX);
        int = int * BigInt(RADIX) + BigInt(isNaN(parsed) ? CHARACTERS.indexOf(char) : parsed);
    }
    return int;
}

export function numberToBitArray(input: number, length: number) {
    return [...Array(length).keys()].map(i => (input >> i) & 1).reverse();
}

export function booleanToBitArray(input: boolean) {
    return input ? [1] : [0];
}
