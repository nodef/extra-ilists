import {
  IDENTITY,
  COMPARE,
} from "extra-function";
import {
  isList   as iterableIsList,
  length   as iterableLength,
  isEmpty  as iterableIsEmpty,
  many     as iterableMany,
  head     as iterableHead,
  take     as iterableTake,
  drop     as iterableDrop,
  hasValue as iterableHasValue,
  map      as iterableMap,
  concat   as iterableConcat,
} from "extra-iterable";
import {
  randomValue as arrayRandomValue,
  zip         as arrayZip,
  chunk       as arrayChunk,
} from "extra-array";
import {
  isDisjoint  as setIsDisjoint,
  concat      as setConcat,
} from "extra-set";
import {
  keys           as entriesKeys,
  values         as entriesValues,
  get            as entriesGet,
  count          as entriesCount,
  countAs        as entriesCountAs,
  rangeEntries   as entriesRangeEntries,
  find           as entriesFind,
  findAll        as entriesFindAll,
  search         as entriesSearch,
  searchAll      as entriesSearchAll,
  searchValue    as entriesSearchValue,
  searchValueAll as entriesSearchValueAll,
  forEach        as entriesForEach,
  some           as entriesSome,
  every          as entriesEvery,
  reduce         as entriesReduce,
  join           as entriesJoin,
} from "extra-entries";
import {
  fromLists    as mapFromLists,
  compare      as mapCompare,
  getAll       as mapGetAll,
  subsets      as mapSubsets,
  randomSubset as mapRandomSubset,
  hasSubset    as mapHasSubset,
  zip          as mapZip,
  concat$      as mapConcat$,
  union        as mapUnion,
  intersection as mapIntersection,
  symmetricDifference as mapSymmetricDifference,
} from "extra-map";




// TYPES
// =====

/** Entries is a list of key-value pairs, with unique keys. */
export type Entries<K, V> = Iterable<[K, V]>;
/** Lists is a pair of key list and value list, with unique keys. */
export type Lists<K, V> = [Iterable<K>, Iterable<V>];


/**
 * Handle reading of a single value.
 * @returns value
 */
export type ReadFunction<T> = () => T;


/**
 * Handle combining of two values.
 * @param a a value
 * @param b another value
 * @returns combined value
 */
export type CombineFunction<T> = (a: T, b: T) => T;


/**
 * Handle comparison of two values.
 * @param a a value
 * @param b another value
 * @returns a<b: -ve, a=b: 0, a>b: +ve
 */
export type CompareFunction<T> = (a: T, b: T) => number;


/**
 * Handle processing of values in lists.
 * @param v value in lists
 * @param k key of value in lists
 * @param x lists containing the value
 */
export type ProcessFunction<K, V> = (v: V, k: K, x: Lists<K, V>) => void;


/**
 * Handle selection of values in lists.
 * @param v value in lists
 * @param k key of value in lists
 * @param x lists containing the value
 * @returns selected?
 */
export type TestFunction<K, V> = (v: V, k: K, x: Lists<K, V>) => boolean;


/**
 * Handle transformation of a value to another.
 * @param v value in lists
 * @param k key of value in lists
 * @param x lists containing the value
 * @returns transformed value
 */
export type MapFunction<K, V, W> = (v: V, k: K, x: Lists<K, V>) => W;


/**
 * Handle reduction of multiple values into a single value.
 * @param acc accumulator (temporary result)
 * @param v value in lists
 * @param k key of value in lists
 * @param x lists containing the value
 * @returns reduced value
 */
export type ReduceFunction<K, V, W> = (acc: W, v: V, k: K, x: Lists<K, V>) => W;


/**
 * Handle ending of combined lists.
 * @param dones iᵗʰ lists done?
 * @returns combined lists done?
 */
export type EndFunction = (dones: boolean[]) => boolean;




// METHODS
// =======

// ABOUT
// -----

/**
 * Check if value is lists.
 * @param v value
 * @returns v is lists?
 */
export function is<K, V>(v: any): v is Lists<K, V> {
  return Array.isArray(v) && v.length===2 && iterableIsList(v[0]) && iterableIsList(v[1]);
}


/**
 * List all keys.
 * @param x lists
 * @returns k₀, k₁, ... | kᵢ ∈ x[0]
 */
export function keys<K, V>(x: Lists<K, V>): Iterable<K> {
  return x[0];
}


/**
 * List all values.
 * @param x lists
 * @returns v₀, v₁, ... | vᵢ ∈ x[1]
 */
export function values<K, V>(x: Lists<K, V>): Iterable<V> {
  return x[1];
}


/**
 * List all key-value pairs.
 * @param x lists
 * @returns [k₀, v₀], [k₁, v₁], ... | kᵢ ∈ x[0]; vᵢ ∈ x[1]
 */
export function* entries<K, V>(x: Lists<K, V>): Entries<K, V> {
  var iv = values(x)[Symbol.iterator]();
  for (var k of keys(x))
    yield [k, iv.next().value];
}




// GENERATE
// --------

/**
 * Convert lists to entries.
 * @param x entries
 * @returns x as lists
 */
export function fromEntries<K, V>(x: Entries<K, V>): Lists<K, V> {
  var ex = iterableMany(x);
  return [entriesKeys(ex), entriesValues(ex)];
}




// SIZE
// ----

/**
 * Find the size of lists.
 * @param x lists
 * @returns |x|
 */
export function size<K, V>(x: Lists<K, V>): number {
  return iterableLength(keys(x));
}
export {size as length};


/**
 * Check if lists is empty.
 * @param x lists
 * @returns |x| = 0?
 */
export function isEmpty<K, V>(x: Lists<K, V>): boolean {
  return iterableIsEmpty(keys(x));
}




// COMPARE
// -------

/**
 * Compare two lists.
 * @param x lists
 * @param y another lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns x=y: 0, otherwise: -ve/+ve
 */
export function compare<K, V, W=V>(x: Lists<K, V>, y: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): number {
  return mapCompare(mapFromLists(x), mapFromLists(y), fc, fm as any);
}


/**
 * Check if two lists are equal.
 * @param x lists
 * @param y another lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns x=y?
 */
export function isEqual<K, V, W=V>(x: Lists<K, V>, y: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  return compare(x, y, fc, fm)===0;
}




// GET/SET
// -------

/**
 * Get value at key.
 * @param x lists
 * @param k key
 * @returns x[k]
 */
export function get<K, V>(x: Lists<K, V>, k: K): V {
  return entriesGet(entries(x), k);
}


/**
 * Gets values at keys.
 * @param x lists
 * @param ks keys
 * @returns x[k₀], x[k₁], ... | [k₀, k₁, ...] = ks
 */
export function getAll<K, V>(x: Lists<K, V>, ks: K[]): Iterable<V> {
  return mapGetAll(mapFromLists(x), ks);
}


/**
 * Get value at path in nested lists.
 * @param x nested lists
 * @param p path
 * @returns x[k₀][k₁][...] | [k₀, k₁, ...] = p
 */
export function getPath<K>(x: Lists<K, any>, p: K[]): any {
  for (var k of p)
    x = is(x)? get(x, k) : undefined;
  return x;
}


/**
 * Check if nested lists has a path.
 * @param x nested lists
 * @param p search path
 * @returns x[k₀][k₁][...] exists? | [k₀, k₁, ...] = p
 */
export function hasPath<T>(x: Lists<T, any>, p: T[]): boolean {
  return getPath(x, p)!==undefined;
}


/**
 * Set value at key.
 * @param x lists
 * @param k key
 * @param v value
 * @returns x' | x' = x; x'[k] = v
 */
export function set<K, V>(x: Lists<K, V>, k: K, v: V): Lists<K, V> {
  var ks = [], vs = [];
  for (var [j, u] of entries(x)) {
    ks.push(j);
    vs.push(j===k? v : u);
  }
  return [ks, vs];
}


/**
 * Exchange two values.
 * @param x lists
 * @param k a key
 * @param l another key
 * @returns x' | x' = x; x'[k] = x[l]; x'[l] = x[k]
 */
export function swap<K, V>(x: Lists<K, V>, k: K, l: K): Lists<K, V> {
  var ks = iterableMap(keys(x), j => j===k? l : (j===l? k : j));
  return [ks, values(x)];
}


/**
 * Remove value at key.
 * @param x lists
 * @param k key
 * @returns x - [k, v] | v = x[k]
 */
export function remove<K, V>(x: Lists<K, V>, k: K): Lists<K, V> {
  var ks = [], vs = [];
  for (var [j, u] of entries(x)) {
    if (j===k) continue;
    ks.push(j);
    vs.push(u);
  }
  return [ks, vs];
}




// PART
// ----

/**
 * Get first entry from lists (default order).
 * @param x lists
 * @param ed default entry
 * @returns [k₀, v₀] if x ≠ Φ else ed | [k₀, v₀] ∈ x
 */
export function head<K, V>(x: Lists<K, V>, ed: [K, V]=[] as any): [K, V] {
  return iterableHead(entries(x), ed);
}


/**
 * Get lists without its first entry (default order).
 * @param x lists
 * @returns x \\ \{[k₀, v₀]\} if x ≠ Φ else x | [k₀, v₀] ∈ x
 */
export function tail<K, V>(x: Lists<K, V>): Lists<K, V> {
  return drop(x, 1);
}


/**
 * Keep first n entries only (default order).
 * @param x lists
 * @param n number of entries [1]
 * @returns \{[k₀, v₀], [k₁, v₁], ...\} | [kᵢ, vᵢ] ∈ x and |\{[k₀, v₀], [k₁, v₁], ...\}| ≤ n
 */
export function take<K, V>(x: Lists<K, V>, n: number=1): Lists<K, V> {
  var ks = iterableTake(keys(x), n);
  var vs = iterableTake(values(x), n);
  return [ks, vs];
}


/**
 * Remove first n entries (default order).
 * @param x a map
 * @param n number of entries [1]
 * @returns \{[kₙ, vₙ], [kₙ₊₁, vₙ₊₁], ...\} | [kᵢ, vᵢ] ∈ x and |\{[kₙ, vₙ], [kₙ₊₁, vₙ₊₁], ...\}| ≤ max(|x| - n, 0)
 */
export function drop<K, V>(x: Lists<K, V>, n: number=1): Lists<K, V> {
  var ks = iterableDrop(keys(x), n);
  var vs = iterableDrop(values(x), n);
  return [ks, vs];
}





// PROPERTY
// --------

/**
 * Count values which satisfy a test.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns Σtᵢ | tᵢ = 1 if ft(vᵢ) else 0; [kᵢ, vᵢ] ∈ x
 */
export function count<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): number {
  return entriesCount(entries(x), ft as any);
}


/**
 * Count occurrences of values.
 * @param x lists
 * @param fm map function (v, k, x)
 * @returns Map \{value ⇒ count\}
 */
export function countAs<K, V, W=V>(x: Lists<K, V>, fm: MapFunction<K, V, V|W> | null=null): Map<V|W, number> {
  return entriesCountAs(entries(x), fm as any);
}


/**
 * Find smallest value.
 * @param x lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns v | v ≤ vᵢ; [kᵢ, vᵢ] ∈ x
 */
export function min<K, V, W=V>(x: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): V {
  return rangeEntries(x, fc, fm)[0][1];
}


/**
 * Find smallest entry.
 * @param x lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [min_key, min_value]
 */
export function minEntry<K, V, W=V>(x: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [K, V] {
  return rangeEntries(x, fc, fm)[0];
}


/**
 * Find largest value.
 * @param x lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns v | v ≥ vᵢ; [kᵢ, vᵢ] ∈ x
 */
export function max<K, V, W=V>(x: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): V {
  return rangeEntries(x, fc, fm)[1][1];
}


/**
 * Find largest entry.
 * @param x lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [max_key, max_value]
 */
export function maxEntry<K, V, W=V>(x: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [K, V] {
  return rangeEntries(x, fc, fm)[1];
}


/**
 * Find smallest and largest values.
 * @param x lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [min_value, max_value]
 */
export function range<K, V, W=V>(x: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [V, V] {
  var [a, b] = rangeEntries(x, fc, fm);
  return [a[1], b[1]];
}


/**
 * Find smallest and largest entries.
 * @param x lists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [min_entry, max_entry]
 */
export function rangeEntries<K, V, W=V>(x: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [[K, V], [K, V]] {
  return entriesRangeEntries(entries(x), fc, fm as any);
}




// ARRANGEMENTS
// ------------

/**
 * List all possible subsets.
 * @param x lists
 * @param n number of entries in each subset [-1 ⇒ any]
 * @returns entries selected by bit from 0..2^|x| if n<0; only of length n otherwise
 */
export function* subsets<K, V>(x: Lists<K, V>, n: number=-1): Iterable<Lists<K, V>> {
  for(var a of mapSubsets(mapFromLists(x), n))
    yield [a.keys(), a.values()];
}


/**
 * Pick an arbitrary key.
 * @param x lists
 * @param fr random number generator ([0, 1))
 * @returns kᵢ | kᵢ ∈ x[0]
 */
export function randomKey<K, V>(x: Lists<K, V>, fr: ReadFunction<number>=Math.random): K {
  return arrayRandomValue([...keys(x)], fr);
}
export {randomKey as key};


/**
 * Pick an arbitrary value.
 * @param x lists
 * @param fr random number generator ([0, 1))
 * @returns vᵢ | vᵢ ∈ x[1]
 */
export function randomValue<K, V>(x: Lists<K, V>, fr: ReadFunction<number>=Math.random): V {
  return arrayRandomValue([...values(x)], fr);
}
export {randomValue as value};


/**
 * Pick an arbitrary entry.
 * @param x lists
 * @param fr random number generator ([0, 1))
 * @returns [kᵢ, vᵢ] | kᵢ ∈ x[0]; vᵢ ∈ x[1]
 */
export function randomEntry<K, V>(x: Lists<K, V>, fr: ReadFunction<number>=Math.random): [K, V] {
  return arrayRandomValue([...entries(x)], fr);
}
export {randomEntry as entry};


/**
 * Pick an arbitrary subset.
 * @param x lists
 * @param n number of entries [-1 ⇒ any]
 * @param fr random number generator ([0, 1))
 * @returns [[kᵢ, kⱼ, ...], [vᵢ, vⱼ, ...]] | kᵢ, kⱼ, ... ∈ x[0]; vᵢ, vⱼ, ... ∈ x[1]; |[kᵢ, kⱼ, , ...]| = |x| if n<0 else n
 */
export function randomSubset<K, V>(x: Lists<K, V>, n: number=-1, fr: ReadFunction<number>=Math.random): Lists<K, V> {
  var a = mapRandomSubset(mapFromLists(x), n, fr);
  return [a.keys(), a.values()];
}
export {randomSubset as subset};




// FIND
// ----

/**
 * Check if lists has a key.
 * @param x lists
 * @param k search key
 * @returns k ∈ keys(x)?
 */
export function has<K, V>(x: Lists<K, V>, k: K): boolean {
  return iterableHasValue(keys(x), k);
}


/**
 * Check if lists has a value.
 * @param x lists
 * @param v search value
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns v ∈ values(x)?
 */
export function hasValue<K, V, W=V>(x: Lists<K, V>, v: V, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  return searchValue(x, v, fc, fm)!==undefined;
}


/**
 * Check if lists has an entry.
 * @param x lists
 * @param e search entry
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns k ∈ x[0]; v ∈ x[1]; k ⇒ v? | [k, v] = e
 */
export function hasEntry<K, V, W=V>(x: Lists<K, V>, e: [K, V], fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  var fc = fc || COMPARE;
  var fm = fm || IDENTITY;
  var [k, v] = e, u = get(x, k);
  var u1 = fm(u, k, x);
  var v1 = fm(v, k, x);
  return fc(u1, v1)===0;
}


/**
 * Check if lists has a subset.
 * @param x lists
 * @param y search subset
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns y ⊆ x?
 */
export function hasSubset<K, V, W=V>(x: Lists<K, V>, y: Lists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  return mapHasSubset(mapFromLists(x), mapFromLists(y), fc, fm as any);
}


/**
 * Find first value passing a test (default order).
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns first v | ft(v) = true; [k, v] ∈ x
 */
export function find<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): V {
  return entriesFind(entries(x), ft as any);
}


/**
 * Find values passing a test.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns v₀, v₁, ... | ft(vᵢ) = true; [kᵢ, vᵢ] ∈ x
 */
export function findAll<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): Iterable<V> {
  return entriesFindAll(entries(x), ft as any);
}


/**
 * Finds key of an entry passing a test.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns key of entry
 */
export function search<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): K {
  return entriesSearch(entries(x), ft as any);
}


/**
 * Find keys of entries passing a test.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns keys of entries
 */
export function searchAll<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): Iterable<K> {
  return entriesSearchAll(entries(x), ft as any);
}


/**
 * Find a key with given value.
 * @param x lists
 * @param v search value
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns key of value
 */
export function searchValue<K, V, W=V>(x: Lists<K, V>, v: V, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): K {
  return entriesSearchValue(entries(x), v, fc, fm as any);
}


/**
 * Find keys with given value.
 * @param x lists
 * @param v search value
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns keys of value
 */
export function searchValueAll<K, V, W=V>(x: Lists<K, V>, v: V, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): Iterable<K> {
  return entriesSearchValueAll(entries(x), v, fc, fm as any);
}




// FUNCTIONAL
// ----------

/**
 * Call a function for each value.
 * @param x lists
 * @param fp process function (v, k, x)
 */
export function forEach<K, V>(x: Lists<K, V>, fc: ProcessFunction<K, V>): void {
  entriesForEach(entries(x), fc as any);
}


/**
 * Check if any value satisfies a test.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns true if ft(vᵢ) = true for some [kᵢ, vᵢ] ∈ x
 */
export function some<K, V>(x: Lists<K, V>, ft: TestFunction<K, V> | null=null): boolean {
  return entriesSome(entries(x), ft as any);
}


/**
 * Check if all values satisfy a test.
 * @param x entries
 * @param ft test function (v, k, x)
 * @returns true if ft(vᵢ) = true for every [kᵢ, vᵢ] ∈ x
 */
export function every<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): boolean {
  return entriesEvery(entries(x), ft as any);
}


/**
 * Transform values of entries.
 * @param x lists
 * @param fm map function (v, k, x)
 * @returns [k₀, fm(v₀)], [k₁, fm(v₁)], ... | [kᵢ, vᵢ] ∈ x
 */
export function map<K, V, W>(x: Lists<K, V>, fm: MapFunction<K, V, W>) {
  var ks = [], vs = [];
  for (var [k, v] of entries(x)) {
    ks.push(k);
    vs.push(fm(v, k, x));
  }
  return [ks, vs];
}


/**
 * Reduce values of entries to a single value.
 * @param x lists
 * @param fr reduce function (acc, v, k, x)
 * @param acc initial value
 * @returns fr(fr(acc, v₀), v₁)... | fr(acc, v₀) = v₀ if acc not given
 */
export function reduce<K, V, W=V>(x: Lists<K, V>, fr: ReduceFunction<K, V, V|W>, acc?: V|W): V|W {
  var A = arguments.length, es = entries(x);
  return A>2? entriesReduce(es, fr as any, acc) : entriesReduce(es, fr as any);
}


/**
 * Keep entries which pass a test.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns [k₀, v₀], [k₁, v₁], ... | ft(vᵢ) = true; [kᵢ, vᵢ] ∈ x
 */
export function filter<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): Lists<K, V> {
  var ks = [], vs = [];
  for (var [k, v] of entries(x))
    if (ft(v, k, x)) { ks.push(k); vs.push(v); }
  return [ks, vs];
}


/**
 * Keep entries with given keys.
 * @param x lists
 * @param ks keys
 * @returns [k₀, v₀], [k₁, v₁], ... | kᵢ ∈ ks; [kᵢ, vᵢ] ∈ x
 */
export function filterAt<K, V>(x: Lists<K, V>, ks: K[]): Lists<K, V> {
  var js = [], us = [];
  for (var [k, v] of entries(x))
    if (ks.includes(k)) { js.push(k); us.push(v); }
  return [js, us];
}


/**
 * Discard entries which pass a test.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns [k₀, v₀], [k₁, v₁], ... | ft(vᵢ) = false; [kᵢ, vᵢ] ∈ x
 */
export function reject<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): Lists<K, V> {
  var ks = [], vs = [];
  for (var [k, v] of entries(x))
    if (!ft(v, k, x)) { ks.push(k); vs.push(v); }
  return [ks, vs];
}


/**
 * Discard entries with given keys.
 * @param x lists
 * @param ks keys
 * @returns [k₀, v₀], [k₁, v₁], ... | kᵢ ∉ ks; [kᵢ, vᵢ] ∈ x
 */
export function rejectAt<K, V>(x: Lists<K, V>, ks: K[]): Lists<K, V> {
  var js = [], us = [];
  for (var [k, v] of entries(x))
    if (!ks.includes(k)) { js.push(k); us.push(v); }
  return [js, us];
}


/**
 * Flatten nested lists to given depth.
 * @param x nested lists
 * @param n maximum depth [-1 ⇒ all]
 * @param fm map function (v, k, x)
 * @param ft test function for flatten (v, k, x) [is]
 * @returns flat lists
 */
export function flat<K>(x: Lists<K, any>, n: number=-1, fm: MapFunction<K, any, any> | null=null, ft: TestFunction<K, any> | null=null): Lists<K, any> {
  var fm = fm || IDENTITY;
  var ft = ft || is;
  var a = flatTo$(new Map(), x, n, fm, ft);
  return [a.keys(), a.values()];
}

function flatTo$<K>(a: Map<K, any>, x: Lists<K, any>, n: number, fm: MapFunction<K, any, any>, ft: TestFunction<K, any>): Map<K, any> {
  for (var [k, v] of entries(x)) {
    var v1 = fm(v, k, x);
    if (n!==0 && ft(v1, k, x)) flatTo$(a, v1, n-1, fm, ft);
    else a.set(k, v1);
  }
  return a;
}


/**
 * Flatten nested lists, based on map function.
 * @param x nested lists
 * @param fm map function (v, k, x)
 * @param ft test function for flatten (v, k, x) [is]
 * @returns flat lists
 */
export function flatMap<K>(x: Lists<K, any>, fm: MapFunction<K, any, any> | null=null, ft: TestFunction<K, any> | null=null): Lists<K, any> {
  var fm = fm || IDENTITY;
  var ft = ft || is;
  var a  = new Map();
  for (var [k, v] of entries(x)) {
    var w = fm(v, k, x);
    if (ft(w, k, x)) mapConcat$(a, entries(w));
    else a.set(k, w);
  }
  return [a.keys(), a.values()];
}


/**
 * Combine matching entries from all lists.
 * @param xs all lists
 * @param fm map function (vs, k)
 * @param ft end function (dones) [some]
 * @param vd default value
 * @returns fm([x₀[k₀], x₁[k₀], ...]), fm([x₀[k₁], x₁[k₁], ...]), ...
 */
export function zip<K, V, W=V>(xs: Lists<K, V>[], fm: MapFunction<K, V[], V[]|W> | null=null, ft: EndFunction=null, vd?: V): Lists<K, V[]|W> {
  var a = mapZip(xs.map(x => new Map(entries(x))), fm as any, ft, vd);
  return [a.keys(), a.values() as any];
}




// MANIPULATION
// ------------

/**
 * Segregate values by test result.
 * @param x lists
 * @param ft test function (v, k, x)
 * @returns [satisfies, doesnt]
 */
export function partition<K, V>(x: Lists<K, V>, ft: TestFunction<K, V>): [Lists<K, V>, Lists<K, V>] {
  var tk = [], tv = [], fk = [], fv = [];
  for (var [k, v] of entries(x)) {
    if (ft(v, k, x)) { tk.push(k); tv.push(v); }
    else             { fk.push(k); fv.push(v); }
  }
  return [[tk, tv], [fk, fv]];
}


/**
 * Segregate entries by similarity.
 * @param x entries
 * @param fm map function (v, k, x)
 * @returns Map \{key ⇒ entries\}
 */
export function partitionAs<K, V, W=V>(x: Lists<K, V>, fm: MapFunction<K, V, V|W> | null=null): Map<V|W, Lists<K, V>> {
  var fm = fm || IDENTITY;
  var a  = new Map();
  for (var [k, v] of entries(x)) {
    var v1 = fm(v, k, x);
    if (!a.has(v1)) a.set(v1, [[], []]);
    var [ak, av] = a.get(v1);
    ak.push(k); av.push(v);
  }
  return a;
}


/**
 * Break lists into chunks of given size.
 * @param x lists
 * @param n chunk size [1]
 * @param s chunk step [n]
 * @returns [x[0..n], x[s..s+n], x[2s..2s+n], ...]
 */
export function chunk<K, V>(x: Lists<K, V>, n: number=1, s: number=n): Lists<K, V>[] {
  var kss = arrayChunk([...keys(x)], n, s);
  var vss = arrayChunk([...values(x)], n, s);
  return arrayZip([kss, vss as any]) as Lists<K, V>[];
}




// COMBINE
// -------

/**
 * Append entries from all lists, preferring last.
 * @param xs all lists
 * @returns x₀ ∪ x₁ ∪ ... | [x₀, x₁, ...] = xs
 */
export function concat<K, V>(...xs: Lists<K, V>[]): Lists<K, V> {
  var ks = iterableConcat(...xs.map(keys));
  var vs = iterableConcat(...xs.map(values));
  var a  = mapFromLists([ks, vs]);
  return [a.keys(), a.values()];
}


/**
 * Join lists together into a string.
 * @param x lists
 * @param sep separator [,]
 * @param asc associator [=]
 * @returns "$\{k₀\}=$\{v₀\},$\{k₁\}=$\{v₁\}..." | [kᵢ, vᵢ] ∈ x
 */
export function join<K, V>(x: Lists<K, V>, sep: string=',', asc: string='='): string {
  return entriesJoin(entries(x), sep, asc);
}




// SET OPERATIONS
// --------------

/**
 * Check if lists have no common keys.
 * @param x lists
 * @param y another lists
 * @returns x ∩ y = Φ?
 */
export function isDisjoint<K, V>(x: Lists<K, V>, y: Lists<K, V>): boolean {
  return setIsDisjoint(new Set(keys(x)), keys(y));
}


/**
 * Obtain keys present in any lists.
 * @param xs all lists
 * @returns \{k₀, k₁, ...\} | [kᵢ, vᵢ] ∈ x₀ ∪ x₁, ...; [x₀, x₁, ...] = xs
 */
export function unionKeys<K, V>(...xs: Lists<K, V>[]): Set<K> {
  return setConcat(...xs.map(x => new Set(keys(x))));
}


/**
 * Obtain entries present in any lists.
 * @param x lists
 * @param y another lists
 * @param fc combine function (a, b)
 * @returns x ∪ y = \{[kᵢ, vᵢ] | [kᵢ, vᵢ] ∈ x or [kᵢ, vᵢ] ∈ y\}
 */
export function union<K, V>(x: Lists<K, V>, y: Lists<K, V>, fc: CombineFunction<V> | null=null): Lists<K, V> {
  var a = mapUnion(entries(x), entries(y), fc);
  return [a.keys(), a.values()];
}


/**
 * Obtain entries present in both lists.
 * @param x lists
 * @param y another lists
 * @param fc combine function (a, b)
 * @returns x ∩ y = \{[kᵢ, vᵢ] | [kᵢ, vᵢ] ∈ x and [kᵢ, vᵢ] ∈ y\}
 */
export function intersection<K, V>(x: Lists<K, V>, y: Lists<K, V>, fc: CombineFunction<V> | null=null): Lists<K, V> {
  var a = mapIntersection(new Map(entries(x)), entries(y), fc);
  return [a.keys(), a.values()];
}


/**
 * Obtain entries not present in another lists.
 * @param x lists
 * @param y another lists
 * @returns x = x - y = \{[kᵢ, vᵢ] | [kᵢ, vᵢ] ∈ x, [kᵢ, *] ∉ y\}
 */
export function difference<K, V>(x: Lists<K, V>, y: Lists<K, V>): Lists<K, V> {
  var a = mapFromLists(x);
  for (var k of keys(y))
    a.delete(k);
  return [a.keys(), a.values()];
}


/**
 * Obtain entries not present in both lists.
 * @param x lists
 * @param y another lists
 * @returns x = x-y ∪ y-x
 */
export function symmetricDifference<K, V>(x: Lists<K, V>, y: Lists<K, V>): Lists<K, V> {
  var a = mapSymmetricDifference(entries(x), entries(y));
  return [a.keys(), a.values()];
}
