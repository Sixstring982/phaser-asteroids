export const buildArray = <T>(
    length: number,
    generator: () => T): readonly T[] =>
    Array(length).fill(undefined).map(generator);