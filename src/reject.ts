import type {testFn, Entries} from './_types';

/**
 * Discards entries which pass a test.
 * @param x lists
 * @param fn test function (v, k, x)
 * @param ths this argument
 */
function reject<T, U>(x: Entries<T, U>, fn: testFn<T, U>, ths: object=null): Map<T, U> {
  var a = new Map();
  for(var [k, v] of x)
    if(!fn.call(ths, v, k, x)) a.set(k, v);
  return a;
}
export default reject;
