import range from './range';
import type {compareFn, mapFn, Lists} from './_types';

/**
 * Finds smallest entry.
 * @param x lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [key, value]
 */
function min<T, U, V=U>(x: Lists<T, U>, fc: compareFn<U|V>=null, fm: mapFn<T, U, U|V>=null): [T, U] {
  return range(x, fc, fm)[0];
}
export default min;
