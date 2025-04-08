**ILists** is a *pair* of *key iterable list* and *value iterable list*, with *unique keys*.<br>
📦 [Node.js](https://www.npmjs.com/package/extra-ilists),
🌐 [Web](https://www.npmjs.com/package/extra-ilists.web),
📜 [Files](https://unpkg.com/extra-ilists/),
📰 [Docs](https://nodef.github.io/extra-ilists/),
📘 [Wiki](https://github.com/nodef/extra-ilists/wiki/).

As mentioned above, **ILists** is a data structure that consists of a *pair of*
*iterable lists*, one for *keys* and one for *values*. The keys are **unique**,
meaning there are no duplicate entries. **ILists** is an iterable version of
[Lists]. Use it when you don't have the keys and values as [Arrays].

This package includes functions that allow you to query *about*, *generate*,
*compare*, and *manipulate* the data within the **ILists**. You can find out its
*size*, *add* and *remove* entries, obtain its *properties*, get *parts* or
*subsets* of the data, *find* specific entries within it, perform *functional*
operations, *combine* **ILists** or its sub-entries, or perform *set operations*
upon it. Except `fromEntries()`, all functions take **ILists** as their first
parameter.

This package is available in *Node.js* and *Web* formats. To use it on the web,
simply use the `extra_ilists` global variable after loading with a `<script>` tag
from the [jsDelivr CDN].

> Stability: [Experimental](https://www.youtube.com/watch?v=L1j93RnIxEo).

[Lists]:  https://www.npmjs.com/package/extra-lists
[Arrays]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[jsDelivr CDN]: https://cdn.jsdelivr.net/npm/extra-ilists.web/index.js

<br>

```javascript
const xilists = require('extra-ilists');
// import * as xilists from 'extra-ilists';
// import * as xilists from 'https://unpkg.com/extra-ilists/index.mjs'; (deno)

var x = [['a', 'b', 'c', 'd', 'e'], [1, 2, 3, 4, 5]];
xilists.filter(x, v => v % 2 === 1);
// → [ [ 'a', 'c', 'e' ], [ 1, 3, 5 ] ]

var x = [['a', 'b', 'c', 'd'], [1, 2, -3, -4]];
xilists.some(x, v => v > 10);
// → false

var x = [['a', 'b', 'c', 'd'], [1, 2, -3, -4]];
xilists.min(x);
// → -4

var x = [['a', 'b', 'c'], [1, 2, 3]];
[...xilists.subsets(x)].map(a => [[...a[0]], [...a[1]]]);
// → [
// →   [ [], [] ],
// →   [ [ 'a' ], [ 1 ] ],
// →   [ [ 'b' ], [ 2 ] ],
// →   [ [ 'a', 'b' ], [ 1, 2 ] ],
// →   [ [ 'c' ], [ 3 ] ],
// →   [ [ 'a', 'c' ], [ 1, 3 ] ],
// →   [ [ 'b', 'c' ], [ 2, 3 ] ],
// →   [ [ 'a', 'b', 'c' ], [ 1, 2, 3 ] ]
// → ]
```

<br>
<br>


## Index

| Property | Description |
|  ----  |  ----  |
| [is] | Check if value is ilists. |
| [keys] | List all keys. |
| [values] | List all values. |
| [entries] | List all key-value pairs. |
|  |  |
| [fromEntries] | Convert ilists to entries. |
|  |  |
| [size] | Find the size of ilists. |
| [isEmpty] | Check if ilists is empty. |
|  |  |
| [compare] | Compare two ilists. |
| [isEqual] | Check if two ilists are equal. |
|  |  |
| [get] | Get value at key. |
| [getAll] | Gets values at keys. |
| [getPath] | Get value at path in nested ilists. |
| [hasPath] | Check if nested ilists has a path. |
| [set] | Set value at key. |
| [swap] | Exchange two values. |
| [remove] | Remove value at key. |
|  |  |
| [head] | Get first entry from ilists (default order). |
| [tail] | Get ilists without its first entry (default order). |
| [take] | Keep first n entries only (default order). |
| [drop] | Remove first n entries (default order). |
|  |  |
| [count] | Count values which satisfy a test. |
| [countAs] | Count occurrences of values. |
| [min] | Find smallest value. |
| [minEntry] | Find smallest entry. |
| [max] | Find largest value. |
| [maxEntry] | Find largest entry. |
| [range] | Find smallest and largest values. |
| [rangeEntries] | Find smallest and largest entries. |
|  |  |
| [subsets] | List all possible subsets. |
| [randomKey] | Pick an arbitrary key. |
| [randomValue] | Pick an arbitrary value. |
| [randomEntry] | Pick an arbitrary entry. |
| [randomSubset] | Pick an arbitrary subset. |
|  |  |
| [has] | Check if ilists has a key. |
| [hasValue] | Check if ilists has a value. |
| [hasEntry] | Check if ilists has an entry. |
| [hasSubset] | Check if ilists has a subset. |
| [find] | Find first value passing a test (default order). |
| [findAll] | Find values passing a test. |
| [search] | Finds key of an entry passing a test. |
| [searchAll] | Find keys of entries passing a test. |
| [searchValue] | Find a key with given value. |
| [searchValueAll] | Find keys with given value. |
|  |  |
| [forEach] | Call a function for each value. |
| [some] | Check if any value satisfies a test. |
| [every] | Check if all values satisfy a test. |
| [map] | Transform values of entries. |
| [reduce] | Reduce values of entries to a single value. |
| [filter] | Keep entries which pass a test. |
| [filterAt] | Keep entries with given keys. |
| [reject] | Discard entries which pass a test. |
| [rejectAt] | Discard entries with given keys. |
| [flat] | Flatten nested ilists to given depth. |
| [flatMap] | Flatten nested ilists, based on map function. |
| [zip] | Combine matching entries from all ilists. |
|  |  |
| [partition] | Segregate values by test result. |
| [partitionAs] | Segregate entries by similarity. |
| [chunk] | Break ilists into chunks of given size. |
|  |  |
| [concat] | Append entries from all ilists, preferring last. |
| [join] | Join ilists together into a string. |
|  |  |
| [isDisjoint] | Check if ilists have no common keys. |
| [unionKeys] | Obtain keys present in any ilists. |
| [union] | Obtain entries present in any ilists. |
| [intersection] | Obtain entries present in both ilists. |
| [difference] | Obtain entries not present in another ilists. |
| [symmetricDifference] | Obtain entries not present in both ilists. |

<br>
<br>


[![](https://img.youtube.com/vi/8O0Nt9qY_vo/maxresdefault.jpg)](https://www.youtube.com/watch?v=8O0Nt9qY_vo)
[![ORG](https://img.shields.io/badge/org-nodef-green?logo=Org)](https://nodef.github.io)
[![Coverage Status](https://coveralls.io/repos/github/nodef/extra-ilists/badge.svg?branch=master)](https://coveralls.io/github/nodef/extra-ilists?branch=master)
[![Test Coverage](https://api.codeclimate.com/v1/badges/05f0ff38d69efa93ebbd/test_coverage)](https://codeclimate.com/github/nodef/extra-ilists/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/05f0ff38d69efa93ebbd/maintainability)](https://codeclimate.com/github/nodef/extra-ilists/maintainability)
![](https://ga-beacon.deno.dev/G-RC63DPBH3P:SH3Eq-NoQ9mwgYeHWxu7cw/github.com/nodef/extra-ilists)

[is]: https://github.com/nodef/extra-ilists/wiki/is
[keys]: https://github.com/nodef/extra-ilists/wiki/keys
[values]: https://github.com/nodef/extra-ilists/wiki/values
[entries]: https://github.com/nodef/extra-ilists/wiki/entries
[fromEntries]: https://github.com/nodef/extra-ilists/wiki/fromEntries
[size]: https://github.com/nodef/extra-ilists/wiki/size
[isEmpty]: https://github.com/nodef/extra-ilists/wiki/isEmpty
[compare]: https://github.com/nodef/extra-ilists/wiki/compare
[isEqual]: https://github.com/nodef/extra-ilists/wiki/isEqual
[get]: https://github.com/nodef/extra-ilists/wiki/get
[getAll]: https://github.com/nodef/extra-ilists/wiki/getAll
[getPath]: https://github.com/nodef/extra-ilists/wiki/getPath
[hasPath]: https://github.com/nodef/extra-ilists/wiki/hasPath
[set]: https://github.com/nodef/extra-ilists/wiki/set
[swap]: https://github.com/nodef/extra-ilists/wiki/swap
[remove]: https://github.com/nodef/extra-ilists/wiki/remove
[head]: https://github.com/nodef/extra-ilists/wiki/head
[tail]: https://github.com/nodef/extra-ilists/wiki/tail
[take]: https://github.com/nodef/extra-ilists/wiki/take
[drop]: https://github.com/nodef/extra-ilists/wiki/drop
[count]: https://github.com/nodef/extra-ilists/wiki/count
[countAs]: https://github.com/nodef/extra-ilists/wiki/countAs
[min]: https://github.com/nodef/extra-ilists/wiki/min
[minEntry]: https://github.com/nodef/extra-ilists/wiki/minEntry
[max]: https://github.com/nodef/extra-ilists/wiki/max
[maxEntry]: https://github.com/nodef/extra-ilists/wiki/maxEntry
[range]: https://github.com/nodef/extra-ilists/wiki/range
[rangeEntries]: https://github.com/nodef/extra-ilists/wiki/rangeEntries
[subsets]: https://github.com/nodef/extra-ilists/wiki/subsets
[randomKey]: https://github.com/nodef/extra-ilists/wiki/randomKey
[randomValue]: https://github.com/nodef/extra-ilists/wiki/randomValue
[randomEntry]: https://github.com/nodef/extra-ilists/wiki/randomEntry
[randomSubset]: https://github.com/nodef/extra-ilists/wiki/randomSubset
[has]: https://github.com/nodef/extra-ilists/wiki/has
[hasValue]: https://github.com/nodef/extra-ilists/wiki/hasValue
[hasEntry]: https://github.com/nodef/extra-ilists/wiki/hasEntry
[hasSubset]: https://github.com/nodef/extra-ilists/wiki/hasSubset
[find]: https://github.com/nodef/extra-ilists/wiki/find
[findAll]: https://github.com/nodef/extra-ilists/wiki/findAll
[search]: https://github.com/nodef/extra-ilists/wiki/search
[searchAll]: https://github.com/nodef/extra-ilists/wiki/searchAll
[searchValue]: https://github.com/nodef/extra-ilists/wiki/searchValue
[searchValueAll]: https://github.com/nodef/extra-ilists/wiki/searchValueAll
[forEach]: https://github.com/nodef/extra-ilists/wiki/forEach
[some]: https://github.com/nodef/extra-ilists/wiki/some
[every]: https://github.com/nodef/extra-ilists/wiki/every
[map]: https://github.com/nodef/extra-ilists/wiki/map
[reduce]: https://github.com/nodef/extra-ilists/wiki/reduce
[filter]: https://github.com/nodef/extra-ilists/wiki/filter
[filterAt]: https://github.com/nodef/extra-ilists/wiki/filterAt
[reject]: https://github.com/nodef/extra-ilists/wiki/reject
[rejectAt]: https://github.com/nodef/extra-ilists/wiki/rejectAt
[flat]: https://github.com/nodef/extra-ilists/wiki/flat
[flatMap]: https://github.com/nodef/extra-ilists/wiki/flatMap
[zip]: https://github.com/nodef/extra-ilists/wiki/zip
[partition]: https://github.com/nodef/extra-ilists/wiki/partition
[partitionAs]: https://github.com/nodef/extra-ilists/wiki/partitionAs
[chunk]: https://github.com/nodef/extra-ilists/wiki/chunk
[concat]: https://github.com/nodef/extra-ilists/wiki/concat
[join]: https://github.com/nodef/extra-ilists/wiki/join
[isDisjoint]: https://github.com/nodef/extra-ilists/wiki/isDisjoint
[unionKeys]: https://github.com/nodef/extra-ilists/wiki/unionKeys
[union]: https://github.com/nodef/extra-ilists/wiki/union
[intersection]: https://github.com/nodef/extra-ilists/wiki/intersection
[difference]: https://github.com/nodef/extra-ilists/wiki/difference
[symmetricDifference]: https://github.com/nodef/extra-ilists/wiki/symmetricDifference
