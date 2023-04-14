import {
  IDENTITY,
  COMPARE,
} from "extra-function";
import * as xiterable from "extra-iterable";
import * as xarray    from "extra-array";
import * as xset      from "extra-set";
import * as xentries  from "extra-entries";
import * as xmap      from "extra-map";




// TYPES
// =====

/** Entries is a list of key-value pairs, with unique keys. */
export type Entries<K, V> = Iterable<[K, V]>;
/** ILists is a pair of key list and value list, with unique keys. */
export type ILists<K, V> = [Iterable<K>, Iterable<V>];


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
 * Handle processing of values in ilists.
 * @param v value in ilists
 * @param k key of value in ilists
 * @param x ilists containing the value
 */
export type ProcessFunction<K, V> = (v: V, k: K, x: ILists<K, V>) => void;


/**
 * Handle selection of values in ilists.
 * @param v value in ilists
 * @param k key of value in ilists
 * @param x ilists containing the value
 * @returns selected?
 */
export type TestFunction<K, V> = (v: V, k: K, x: ILists<K, V>) => boolean;


/**
 * Handle transformation of a value to another.
 * @param v value in ilists
 * @param k key of value in ilists
 * @param x ilists containing the value
 * @returns transformed value
 */
export type MapFunction<K, V, W> = (v: V, k: K, x: ILists<K, V>) => W;


/**
 * Handle reduction of multiple values into a single value.
 * @param acc accumulator (temporary result)
 * @param v value in ilists
 * @param k key of value in ilists
 * @param x ilists containing the value
 * @returns reduced value
 */
export type ReduceFunction<K, V, W> = (acc: W, v: V, k: K, x: ILists<K, V>) => W;


/**
 * Handle ending of combined ilists.
 * @param dones iᵗʰ ilists done?
 * @returns combined ilists done?
 */
export type EndFunction = (dones: boolean[]) => boolean;




// METHODS
// =======

// ABOUT
// -----

/**
 * Check if value is ilists.
 * @param v value
 * @returns v is ilists?
 */
export function is<K, V>(v: any): v is ILists<K, V> {
  return Array.isArray(v) && v.length===2 && xiterable.isList(v[0]) && xiterable.isList(v[1]);
}


/**
 * List all keys.
 * @param x ilists
 * @returns k₀, k₁, ... | kᵢ ∈ x[0]
 */
export function keys<K, V>(x: ILists<K, V>): Iterable<K> {
  return x[0];
}


/**
 * List all values.
 * @param x ilists
 * @returns v₀, v₁, ... | vᵢ ∈ x[1]
 */
export function values<K, V>(x: ILists<K, V>): Iterable<V> {
  return x[1];
}


/**
 * List all key-value pairs.
 * @param x ilists
 * @returns [k₀, v₀], [k₁, v₁], ... | kᵢ ∈ x[0]; vᵢ ∈ x[1]
 */
export function* entries<K, V>(x: ILists<K, V>): Entries<K, V> {
  var iv = values(x)[Symbol.iterator]();
  for (var k of keys(x))
    yield [k, iv.next().value];
}




// GENERATE
// --------

/**
 * Convert ilists to entries.
 * @param x entries
 * @returns x as ilists
 */
export function fromEntries<K, V>(x: Entries<K, V>): ILists<K, V> {
  var ex = xiterable.many(x);
  return [xentries.keys(ex), xentries.values(ex)];
}




// SIZE
// ----

/**
 * Find the size of ilists.
 * @param x ilists
 * @returns |x|
 */
export function size<K, V>(x: ILists<K, V>): number {
  return xiterable.length(keys(x));
}
export {size as length};


/**
 * Check if ilists is empty.
 * @param x ilists
 * @returns |x| = 0?
 */
export function isEmpty<K, V>(x: ILists<K, V>): boolean {
  return xiterable.isEmpty(keys(x));
}




// COMPARE
// -------

/**
 * Compare two ilists.
 * @param x ilists
 * @param y another ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns x=y: 0, otherwise: -ve/+ve
 */
export function compare<K, V, W=V>(x: ILists<K, V>, y: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): number {
  return xmap.compare(xmap.fromLists(x), xmap.fromLists(y), fc, fm as any);
}


/**
 * Check if two ilists are equal.
 * @param x ilists
 * @param y another ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns x=y?
 */
export function isEqual<K, V, W=V>(x: ILists<K, V>, y: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  return compare(x, y, fc, fm)===0;
}




// GET/SET
// -------

/**
 * Get value at key.
 * @param x ilists
 * @param k key
 * @returns x[k]
 */
export function get<K, V>(x: ILists<K, V>, k: K): V {
  return xentries.get(entries(x), k);
}


/**
 * Gets values at keys.
 * @param x ilists
 * @param ks keys
 * @returns x[k₀], x[k₁], ... | [k₀, k₁, ...] = ks
 */
export function getAll<K, V>(x: ILists<K, V>, ks: K[]): Iterable<V> {
  return xmap.getAll(xmap.fromLists(x), ks);
}


/**
 * Get value at path in nested ilists.
 * @param x nested ilists
 * @param p path
 * @returns x[k₀][k₁][...] | [k₀, k₁, ...] = p
 */
export function getPath<K>(x: ILists<K, any>, p: K[]): any {
  for (var k of p)
    x = is(x)? get(x, k) : undefined;
  return x;
}


/**
 * Check if nested ilists has a path.
 * @param x nested ilists
 * @param p search path
 * @returns x[k₀][k₁][...] exists? | [k₀, k₁, ...] = p
 */
export function hasPath<T>(x: ILists<T, any>, p: T[]): boolean {
  return getPath(x, p)!==undefined;
}


/**
 * Set value at key.
 * @param x ilists
 * @param k key
 * @param v value
 * @returns x' | x' = x; x'[k] = v
 */
export function set<K, V>(x: ILists<K, V>, k: K, v: V): ILists<K, V> {
  var ks = [], vs = [];
  for (var [j, u] of entries(x)) {
    ks.push(j);
    vs.push(j===k? v : u);
  }
  return [ks, vs];
}


/**
 * Exchange two values.
 * @param x ilists
 * @param k a key
 * @param l another key
 * @returns x' | x' = x; x'[k] = x[l]; x'[l] = x[k]
 */
export function swap<K, V>(x: ILists<K, V>, k: K, l: K): ILists<K, V> {
  var ks = xiterable.map(keys(x), j => j===k? l : (j===l? k : j));
  return [ks, values(x)];
}


/**
 * Remove value at key.
 * @param x ilists
 * @param k key
 * @returns x - [k, v] | v = x[k]
 */
export function remove<K, V>(x: ILists<K, V>, k: K): ILists<K, V> {
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
 * Get first entry from ilists (default order).
 * @param x ilists
 * @param ed default entry
 * @returns [k₀, v₀] if x ≠ Φ else ed | [k₀, v₀] ∈ x
 */
export function head<K, V>(x: ILists<K, V>, ed: [K, V]=[] as any): [K, V] {
  return xiterable.head(entries(x), ed);
}


/**
 * Get ilists without its first entry (default order).
 * @param x ilists
 * @returns x \\ \{[k₀, v₀]\} if x ≠ Φ else x | [k₀, v₀] ∈ x
 */
export function tail<K, V>(x: ILists<K, V>): ILists<K, V> {
  return drop(x, 1);
}


/**
 * Keep first n entries only (default order).
 * @param x ilists
 * @param n number of entries [1]
 * @returns \{[k₀, v₀], [k₁, v₁], ...\} | [kᵢ, vᵢ] ∈ x and |\{[k₀, v₀], [k₁, v₁], ...\}| ≤ n
 */
export function take<K, V>(x: ILists<K, V>, n: number=1): ILists<K, V> {
  var ks = xiterable.take(keys(x), n);
  var vs = xiterable.take(values(x), n);
  return [ks, vs];
}


/**
 * Remove first n entries (default order).
 * @param x a map
 * @param n number of entries [1]
 * @returns \{[kₙ, vₙ], [kₙ₊₁, vₙ₊₁], ...\} | [kᵢ, vᵢ] ∈ x and |\{[kₙ, vₙ], [kₙ₊₁, vₙ₊₁], ...\}| ≤ max(|x| - n, 0)
 */
export function drop<K, V>(x: ILists<K, V>, n: number=1): ILists<K, V> {
  var ks = xiterable.drop(keys(x), n);
  var vs = xiterable.drop(values(x), n);
  return [ks, vs];
}





// PROPERTY
// --------

/**
 * Count values which satisfy a test.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns Σtᵢ | tᵢ = 1 if ft(vᵢ) else 0; [kᵢ, vᵢ] ∈ x
 */
export function count<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): number {
  return xentries.count(entries(x), ft as any);
}


/**
 * Count occurrences of values.
 * @param x ilists
 * @param fm map function (v, k, x)
 * @returns Map \{value ⇒ count\}
 */
export function countAs<K, V, W=V>(x: ILists<K, V>, fm: MapFunction<K, V, V|W> | null=null): Map<V|W, number> {
  return xentries.countAs(entries(x), fm as any);
}


/**
 * Find smallest value.
 * @param x ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns v | v ≤ vᵢ; [kᵢ, vᵢ] ∈ x
 */
export function min<K, V, W=V>(x: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): V {
  return rangeEntries(x, fc, fm)[0][1];
}


/**
 * Find smallest entry.
 * @param x ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [min_key, min_value]
 */
export function minEntry<K, V, W=V>(x: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [K, V] {
  return rangeEntries(x, fc, fm)[0];
}


/**
 * Find largest value.
 * @param x ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns v | v ≥ vᵢ; [kᵢ, vᵢ] ∈ x
 */
export function max<K, V, W=V>(x: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): V {
  return rangeEntries(x, fc, fm)[1][1];
}


/**
 * Find largest entry.
 * @param x ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [max_key, max_value]
 */
export function maxEntry<K, V, W=V>(x: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [K, V] {
  return rangeEntries(x, fc, fm)[1];
}


/**
 * Find smallest and largest values.
 * @param x ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [min_value, max_value]
 */
export function range<K, V, W=V>(x: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [V, V] {
  var [a, b] = rangeEntries(x, fc, fm);
  return [a[1], b[1]];
}


/**
 * Find smallest and largest entries.
 * @param x ilists
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns [min_entry, max_entry]
 */
export function rangeEntries<K, V, W=V>(x: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): [[K, V], [K, V]] {
  return xentries.rangeEntries(entries(x), fc, fm as any);
}




// ARRANGEMENTS
// ------------

/**
 * List all possible subsets.
 * @param x ilists
 * @param n number of entries in each subset [-1 ⇒ any]
 * @returns entries selected by bit from 0..2^|x| if n<0; only of length n otherwise
 */
export function* subsets<K, V>(x: ILists<K, V>, n: number=-1): Iterable<ILists<K, V>> {
  for(var a of xmap.subsets(xmap.fromLists(x), n))
    yield [a.keys(), a.values()];
}


/**
 * Pick an arbitrary key.
 * @param x ilists
 * @param fr random number generator ([0, 1))
 * @returns kᵢ | kᵢ ∈ x[0]
 */
export function randomKey<K, V>(x: ILists<K, V>, fr: ReadFunction<number>=Math.random): K {
  return xarray.randomValue([...keys(x)], fr);
}
export {randomKey as key};


/**
 * Pick an arbitrary value.
 * @param x ilists
 * @param fr random number generator ([0, 1))
 * @returns vᵢ | vᵢ ∈ x[1]
 */
export function randomValue<K, V>(x: ILists<K, V>, fr: ReadFunction<number>=Math.random): V {
  return xarray.randomValue([...values(x)], fr);
}
export {randomValue as value};


/**
 * Pick an arbitrary entry.
 * @param x ilists
 * @param fr random number generator ([0, 1))
 * @returns [kᵢ, vᵢ] | kᵢ ∈ x[0]; vᵢ ∈ x[1]
 */
export function randomEntry<K, V>(x: ILists<K, V>, fr: ReadFunction<number>=Math.random): [K, V] {
  return xarray.randomValue([...entries(x)], fr);
}
export {randomEntry as entry};


/**
 * Pick an arbitrary subset.
 * @param x ilists
 * @param n number of entries [-1 ⇒ any]
 * @param fr random number generator ([0, 1))
 * @returns [[kᵢ, kⱼ, ...], [vᵢ, vⱼ, ...]] | kᵢ, kⱼ, ... ∈ x[0]; vᵢ, vⱼ, ... ∈ x[1]; |[kᵢ, kⱼ, , ...]| = |x| if n<0 else n
 */
export function randomSubset<K, V>(x: ILists<K, V>, n: number=-1, fr: ReadFunction<number>=Math.random): ILists<K, V> {
  var a = xmap.randomSubset(xmap.fromLists(x), n, fr);
  return [a.keys(), a.values()];
}
export {randomSubset as subset};




// FIND
// ----

/**
 * Check if ilists has a key.
 * @param x ilists
 * @param k search key
 * @returns k ∈ keys(x)?
 */
export function has<K, V>(x: ILists<K, V>, k: K): boolean {
  return xiterable.hasValue(keys(x), k);
}


/**
 * Check if ilists has a value.
 * @param x ilists
 * @param v search value
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns v ∈ values(x)?
 */
export function hasValue<K, V, W=V>(x: ILists<K, V>, v: V, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  return searchValue(x, v, fc, fm)!==undefined;
}


/**
 * Check if ilists has an entry.
 * @param x ilists
 * @param e search entry
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns k ∈ x[0]; v ∈ x[1]; k ⇒ v? | [k, v] = e
 */
export function hasEntry<K, V, W=V>(x: ILists<K, V>, e: [K, V], fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  var fc = fc || COMPARE;
  var fm = fm || IDENTITY;
  var [k, v] = e, u = get(x, k);
  var u1 = fm(u, k, x);
  var v1 = fm(v, k, x);
  return fc(u1, v1)===0;
}


/**
 * Check if ilists has a subset.
 * @param x ilists
 * @param y search subset
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns y ⊆ x?
 */
export function hasSubset<K, V, W=V>(x: ILists<K, V>, y: ILists<K, V>, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): boolean {
  return xmap.hasSubset(xmap.fromLists(x), xmap.fromLists(y), fc, fm as any);
}


/**
 * Find first value passing a test (default order).
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns first v | ft(v) = true; [k, v] ∈ x
 */
export function find<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): V {
  return xentries.find(entries(x), ft as any);
}


/**
 * Find values passing a test.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns v₀, v₁, ... | ft(vᵢ) = true; [kᵢ, vᵢ] ∈ x
 */
export function findAll<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): Iterable<V> {
  return xentries.findAll(entries(x), ft as any);
}


/**
 * Finds key of an entry passing a test.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns key of entry
 */
export function search<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): K {
  return xentries.search(entries(x), ft as any);
}


/**
 * Find keys of entries passing a test.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns keys of entries
 */
export function searchAll<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): Iterable<K> {
  return xentries.searchAll(entries(x), ft as any);
}


/**
 * Find a key with given value.
 * @param x ilists
 * @param v search value
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns key of value
 */
export function searchValue<K, V, W=V>(x: ILists<K, V>, v: V, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): K {
  return xentries.searchValue(entries(x), v, fc, fm as any);
}


/**
 * Find keys with given value.
 * @param x ilists
 * @param v search value
 * @param fc compare function (a, b)
 * @param fm map function (v, k, x)
 * @returns keys of value
 */
export function searchValueAll<K, V, W=V>(x: ILists<K, V>, v: V, fc: CompareFunction<V|W> | null=null, fm: MapFunction<K, V, V|W> | null=null): Iterable<K> {
  return xentries.searchValueAll(entries(x), v, fc, fm as any);
}




// FUNCTIONAL
// ----------

/**
 * Call a function for each value.
 * @param x ilists
 * @param fp process function (v, k, x)
 */
export function forEach<K, V>(x: ILists<K, V>, fc: ProcessFunction<K, V>): void {
  xentries.forEach(entries(x), fc as any);
}


/**
 * Check if any value satisfies a test.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns true if ft(vᵢ) = true for some [kᵢ, vᵢ] ∈ x
 */
export function some<K, V>(x: ILists<K, V>, ft: TestFunction<K, V> | null=null): boolean {
  return xentries.some(entries(x), ft as any);
}


/**
 * Check if all values satisfy a test.
 * @param x entries
 * @param ft test function (v, k, x)
 * @returns true if ft(vᵢ) = true for every [kᵢ, vᵢ] ∈ x
 */
export function every<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): boolean {
  return xentries.every(entries(x), ft as any);
}


/**
 * Transform values of entries.
 * @param x ilists
 * @param fm map function (v, k, x)
 * @returns [k₀, fm(v₀)], [k₁, fm(v₁)], ... | [kᵢ, vᵢ] ∈ x
 */
export function map<K, V, W>(x: ILists<K, V>, fm: MapFunction<K, V, W>) {
  var ks = [], vs = [];
  for (var [k, v] of entries(x)) {
    ks.push(k);
    vs.push(fm(v, k, x));
  }
  return [ks, vs];
}


/**
 * Reduce values of entries to a single value.
 * @param x ilists
 * @param fr reduce function (acc, v, k, x)
 * @param acc initial value
 * @returns fr(fr(acc, v₀), v₁)... | fr(acc, v₀) = v₀ if acc not given
 */
export function reduce<K, V, W=V>(x: ILists<K, V>, fr: ReduceFunction<K, V, V|W>, acc?: V|W): V|W {
  var A = arguments.length, es = entries(x);
  return A>2? xentries.reduce(es, fr as any, acc) : xentries.reduce(es, fr as any);
}


/**
 * Keep entries which pass a test.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns [k₀, v₀], [k₁, v₁], ... | ft(vᵢ) = true; [kᵢ, vᵢ] ∈ x
 */
export function filter<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): ILists<K, V> {
  var ks = [], vs = [];
  for (var [k, v] of entries(x))
    if (ft(v, k, x)) { ks.push(k); vs.push(v); }
  return [ks, vs];
}


/**
 * Keep entries with given keys.
 * @param x ilists
 * @param ks keys
 * @returns [k₀, v₀], [k₁, v₁], ... | kᵢ ∈ ks; [kᵢ, vᵢ] ∈ x
 */
export function filterAt<K, V>(x: ILists<K, V>, ks: K[]): ILists<K, V> {
  var js = [], us = [];
  for (var [k, v] of entries(x))
    if (ks.includes(k)) { js.push(k); us.push(v); }
  return [js, us];
}


/**
 * Discard entries which pass a test.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns [k₀, v₀], [k₁, v₁], ... | ft(vᵢ) = false; [kᵢ, vᵢ] ∈ x
 */
export function reject<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): ILists<K, V> {
  var ks = [], vs = [];
  for (var [k, v] of entries(x))
    if (!ft(v, k, x)) { ks.push(k); vs.push(v); }
  return [ks, vs];
}


/**
 * Discard entries with given keys.
 * @param x ilists
 * @param ks keys
 * @returns [k₀, v₀], [k₁, v₁], ... | kᵢ ∉ ks; [kᵢ, vᵢ] ∈ x
 */
export function rejectAt<K, V>(x: ILists<K, V>, ks: K[]): ILists<K, V> {
  var js = [], us = [];
  for (var [k, v] of entries(x))
    if (!ks.includes(k)) { js.push(k); us.push(v); }
  return [js, us];
}


/**
 * Flatten nested ilists to given depth.
 * @param x nested ilists
 * @param n maximum depth [-1 ⇒ all]
 * @param fm map function (v, k, x)
 * @param ft test function for flatten (v, k, x) [is]
 * @returns flat ilists
 */
export function flat<K>(x: ILists<K, any>, n: number=-1, fm: MapFunction<K, any, any> | null=null, ft: TestFunction<K, any> | null=null): ILists<K, any> {
  var fm = fm || IDENTITY;
  var ft = ft || is;
  var a = flatTo$(new Map(), x, n, fm, ft);
  return [a.keys(), a.values()];
}

function flatTo$<K>(a: Map<K, any>, x: ILists<K, any>, n: number, fm: MapFunction<K, any, any>, ft: TestFunction<K, any>): Map<K, any> {
  for (var [k, v] of entries(x)) {
    var v1 = fm(v, k, x);
    if (n!==0 && ft(v1, k, x)) flatTo$(a, v1, n-1, fm, ft);
    else a.set(k, v1);
  }
  return a;
}


/**
 * Flatten nested ilists, based on map function.
 * @param x nested ilists
 * @param fm map function (v, k, x)
 * @param ft test function for flatten (v, k, x) [is]
 * @returns flat ilists
 */
export function flatMap<K>(x: ILists<K, any>, fm: MapFunction<K, any, any> | null=null, ft: TestFunction<K, any> | null=null): ILists<K, any> {
  var fm = fm || IDENTITY;
  var ft = ft || is;
  var a  = new Map();
  for (var [k, v] of entries(x)) {
    var w = fm(v, k, x);
    if (ft(w, k, x)) xmap.concat$(a, entries(w));
    else a.set(k, w);
  }
  return [a.keys(), a.values()];
}


/**
 * Combine matching entries from all ilists.
 * @param xs all ilists
 * @param fm map function (vs, k)
 * @param ft end function (dones) [some]
 * @param vd default value
 * @returns fm([x₀[k₀], x₁[k₀], ...]), fm([x₀[k₁], x₁[k₁], ...]), ...
 */
export function zip<K, V, W=V>(xs: ILists<K, V>[], fm: MapFunction<K, V[], V[]|W> | null=null, ft: EndFunction=null, vd?: V): ILists<K, V[]|W> {
  var a = xmap.zip(xs.map(x => new Map(entries(x))), fm as any, ft, vd);
  return [a.keys(), a.values() as any];
}




// MANIPULATION
// ------------

/**
 * Segregate values by test result.
 * @param x ilists
 * @param ft test function (v, k, x)
 * @returns [satisfies, doesnt]
 */
export function partition<K, V>(x: ILists<K, V>, ft: TestFunction<K, V>): [ILists<K, V>, ILists<K, V>] {
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
export function partitionAs<K, V, W=V>(x: ILists<K, V>, fm: MapFunction<K, V, V|W> | null=null): Map<V|W, ILists<K, V>> {
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
 * Break ilists into chunks of given size.
 * @param x ilists
 * @param n chunk size [1]
 * @param s chunk step [n]
 * @returns [x[0..n], x[s..s+n], x[2s..2s+n], ...]
 */
export function chunk<K, V>(x: ILists<K, V>, n: number=1, s: number=n): ILists<K, V>[] {
  var kss = xarray.chunk([...keys(x)], n, s);
  var vss = xarray.chunk([...values(x)], n, s);
  return xarray.zip([kss, vss as any]) as ILists<K, V>[];
}




// COMBINE
// -------

/**
 * Append entries from all ilists, preferring last.
 * @param xs all ilists
 * @returns x₀ ∪ x₁ ∪ ... | [x₀, x₁, ...] = xs
 */
export function concat<K, V>(...xs: ILists<K, V>[]): ILists<K, V> {
  var ks = xiterable.concat(...xs.map(keys));
  var vs = xiterable.concat(...xs.map(values));
  var a  = xmap.fromLists([ks, vs]);
  return [a.keys(), a.values()];
}


/**
 * Join ilists together into a string.
 * @param x ilists
 * @param sep separator [,]
 * @param asc associator [=]
 * @returns "$\{k₀\}=$\{v₀\},$\{k₁\}=$\{v₁\}..." | [kᵢ, vᵢ] ∈ x
 */
export function join<K, V>(x: ILists<K, V>, sep: string=',', asc: string='='): string {
  return xentries.join(entries(x), sep, asc);
}




// SET OPERATIONS
// --------------

/**
 * Check if ilists have no common keys.
 * @param x ilists
 * @param y another ilists
 * @returns x ∩ y = Φ?
 */
export function isDisjoint<K, V>(x: ILists<K, V>, y: ILists<K, V>): boolean {
  return xset.isDisjoint(new Set(keys(x)), keys(y));
}


/**
 * Obtain keys present in any ilists.
 * @param xs all ilists
 * @returns \{k₀, k₁, ...\} | [kᵢ, vᵢ] ∈ x₀ ∪ x₁, ...; [x₀, x₁, ...] = xs
 */
export function unionKeys<K, V>(...xs: ILists<K, V>[]): Set<K> {
  return xset.concat(...xs.map(x => new Set(keys(x))));
}


/**
 * Obtain entries present in any ilists.
 * @param x ilists
 * @param y another ilists
 * @param fc combine function (a, b)
 * @returns x ∪ y = \{[kᵢ, vᵢ] | [kᵢ, vᵢ] ∈ x or [kᵢ, vᵢ] ∈ y\}
 */
export function union<K, V>(x: ILists<K, V>, y: ILists<K, V>, fc: CombineFunction<V> | null=null): ILists<K, V> {
  var a = xmap.union(entries(x), entries(y), fc);
  return [a.keys(), a.values()];
}


/**
 * Obtain entries present in both ilists.
 * @param x ilists
 * @param y another ilists
 * @param fc combine function (a, b)
 * @returns x ∩ y = \{[kᵢ, vᵢ] | [kᵢ, vᵢ] ∈ x and [kᵢ, vᵢ] ∈ y\}
 */
export function intersection<K, V>(x: ILists<K, V>, y: ILists<K, V>, fc: CombineFunction<V> | null=null): ILists<K, V> {
  var a = xmap.intersection(new Map(entries(x)), entries(y), fc);
  return [a.keys(), a.values()];
}


/**
 * Obtain entries not present in another ilists.
 * @param x ilists
 * @param y another ilists
 * @returns x = x - y = \{[kᵢ, vᵢ] | [kᵢ, vᵢ] ∈ x, [kᵢ, *] ∉ y\}
 */
export function difference<K, V>(x: ILists<K, V>, y: ILists<K, V>): ILists<K, V> {
  var a = xmap.fromLists(x);
  for (var k of keys(y))
    a.delete(k);
  return [a.keys(), a.values()];
}


/**
 * Obtain entries not present in both ilists.
 * @param x ilists
 * @param y another ilists
 * @returns x = x-y ∪ y-x
 */
export function symmetricDifference<K, V>(x: ILists<K, V>, y: ILists<K, V>): ILists<K, V> {
  var a = xmap.symmetricDifference(entries(x), entries(y));
  return [a.keys(), a.values()];
}
