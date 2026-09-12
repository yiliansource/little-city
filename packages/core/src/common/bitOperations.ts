/**
 * Computes the population count (i.e. 1-bits) in the binary representation of the given number.
 *
 * @see https://en.wikipedia.org/wiki/Hamming_weight#Efficient_implementation
 */
export function popCount(x: number): number {
	x -= (x >> 1) & 0x55555555;
	x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
	x = (x + (x >> 4)) & 0x0f0f0f0f;
	x += x >> 8;
	x += x >> 16;

	return x & 0x7f;
}
