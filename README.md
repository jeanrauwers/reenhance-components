reenhance-components
============

A collection of React components which enhance children by providing Async/State functionality in JSX/TSX.

Works well when you create a component which has some local states (e.g. radio group, toggle show/hide) or needs to show contents from API without propagating to global state (e.g. suggest, preview).

---

## What is this?

This module provides components which can ennhance their children into stateful, data-feeded components.

They are neither HoCs or interactive components but components based on 'Function as a child component' pattern to enhance their children by encapsulating them on JSX/TSX.

## Installation and Usage

### ES6/TS via npm

```sh
npm install reenhance-components
```

### CDN

For CDN, you can use [unpkg](https://unpkg.com/):
https://unpkg.com/reenhance-components/umd/index.min.js

The global namespace is `ReenhanceComponents`:

```js
const { StateProvider, AsyncResolver, DebouncePropagator } = ReenhanceComponents;
```

## Documentation

Each components must be instantiated with initial props/state beforehand.

### AsyncResolver

Resolves async function and passes its result to props of children.

#### Parameters

| Property | Type | Required | Description |
|:---|:---|:---|:---|
| distinctKey | string | N | Name of prop to detect changes. The default is 'subject'. |
| initialProps | object | N | Initial props for children |

#### Props

| Property | Type | Required | Description |
|:---|:---|:---|:---|
| subject | Function | Y | An async function which returns promise to resolve |
| (other props) | any | N | Arguments to subject |

#### Arguments of children

| Property | Type | Description |
|:---|:---|:---|
| props | object | Resolved object from result of subject |

#### Example

```js
const asyncFetch =
  ({ query }) =>
    fetch(queryToUrl(query))
      .then(res => res.json())
      .catch(err => ({ error: err.toString() }));

const AlbumsAsyncResolver = AsyncResolver('query', { resultCount: 0, results: [] });

const Albums = ({ query }) => (
  <AlbumsAsyncResolver subject={asyncFetch} query={query} >
    {(props) => (
      ...
    )}
  </AlbumsAsyncResolver>
);
```

### StateProvider

Provides local state and updater to children as its props.

#### Parameters

| Property | Type | Required | Description |
|:---|:---|:---|:---|
| initialState | any | Y | Initial state |

#### Props

nothing

#### Arguments of children

| Property | Type | Description |
|:---|:---|:---|
| state | object | Current state object |
| setState | Function | An updater for state. Takes new state as its argument |

#### Example

```js
const ToggleState = StateProvider(false);

const Toggle = () => (
  <ToggleState>
    {({ state, setState }) => (
      ...
    )}
  </ToggleState>
);
```

### DebouncePropagator

Debounces props propagation for given milliseconds.

See [Debounce of ReactiveX docs](http://reactivex.io/documentation/operators/debounce.html) for more details.

#### Parameters

| Property | Type | Required | Description |
|:---|:---|:---|:---|
| initialProps | object | N | Initial props for children |

#### Props

| Property | Type | Required | Description |
|:---|:---|:---|:---|
| time | number | Y | Debounce time in milliseconds |
| (other props) | any | N | Properties to propagete to children |

#### Arguments of children

| Property | Type | Description |
|:---|:---|:---|
| props | object | Resolved object from result of subject |

#### Example

```js
const SuggestDebounce = DebouncePropagator({ status: 'loading' });

const Suggest = ({ query }) => (
  <SuggestDebounce time={'200'} query={query}>
    {({ query, status }) => ( // Propagation of 'query' is debounced in 200ms
      ...
    )}
  </SuggestDebounce>
);
```

## FAQ

- Q: Is this an alternative to Redux?  
A: No. This module doesn't provide global state or flow pattern.
- Q: Should I use this instead of Redux?  
A: It depends. If the state or API response is local and per-instance, probably this module fits well.
- Q: Is this better than HoCs?  
A: Not sure. I think they are almost same. 😉
- Q: Can I rename arguments, 'state' and 'setState' of StateProvider?  
A: Rename them in destructuring like `({ state: isOpen, setState: setIsOpen })`.

## For contributors

This project aims these characteristics.

* declarative
* separation of view and logic
* can coexist with other modules
* works well with TypeScript