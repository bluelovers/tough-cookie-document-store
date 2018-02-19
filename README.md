# tough-cookie-document-store

> tough-cookie store use document.cookie adapter

`npm install tough-cookie tough-cookie-document-store`

## usage

```ts
import DocumentCookieStore from 'tough-cookie-document-store';
import * as toughCookie from 'tough-cookie';
```

### for node.js

u can make a document ny jsdom

```ts
import { createJSDOM } from 'jsdom-extra';
let jsdom = createJSDOM();
let document = jsdom.document;
```

### demo

```ts
let store: DocumentCookieStore;

if (typeof document != 'undefined' && document)
{
	// if ur document not a global, this can help
	store = new DocumentCookieStore(document);
}
else
{
	// will auto use global document
	store = new DocumentCookieStore();
}

let jar = new toughCookie.CookieJar(store);

// ... anything u wanna do
```

### other options

```ts
new DocumentCookieStore(document, another new toughCookie.Store for cache)
```
